const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { prisma } = require('../../config/db');
const { sendMail } = require('../../config/mailer');

const PROFILE_SELECT = {
  id: true, name: true, email: true, role: true,
  category: true, phone: true, createdAt: true, updatedAt: true,
};

class AuthService {
  async register({ name, email, password, phone, role }) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    // Self-registration only ever grants USER or TRADER — ADMIN can't be
    // chosen here. A self-registered trader starts inactive and can't log in
    // until an admin approves the account.
    const normalizedRole = role === 'TRADER' ? 'TRADER' : 'USER';
    const isActive = normalizedRole !== 'TRADER';

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, phone, role: normalizedRole, isActive },
      select: { id: true, name: true, email: true, role: true, category: true, phone: true, isActive: true, createdAt: true },
    });

    if (!isActive) {
      return { user, pending: true };
    }

    const token = this.generateToken(user.id);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
    }

    if (!user.isActive) {
      const message = user.role === 'TRADER'
        ? 'Your trader account is pending admin approval'
        : 'Your account has been deactivated. Please contact an administrator.';
      throw Object.assign(new Error(message), { statusCode: 403 });
    }

    const token = this.generateToken(user.id);
    const { password: _, resetPasswordToken: __, resetPasswordExpires: ___, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true,
        category: true, phone: true, createdAt: true, updatedAt: true,
        adaptations: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }
    return user;
  }

  async updateProfile(userId, { name, phone }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name, phone },
      select: PROFILE_SELECT,
    });
    return user;
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      throw Object.assign(new Error('Current password is incorrect'), { statusCode: 401 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    return { message: 'Password updated successfully' };
  }

  async forgotPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return the same response whether or not the account exists,
    // so this endpoint can't be used to check which emails are registered.
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: { resetPasswordToken: hashedToken, resetPasswordExpires: expires },
      });

      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${rawToken}`;
      try {
        await sendMail({
          to: user.email,
          subject: 'Reset your Kiramart password',
          html: `<p>Hello ${user.name},</p>
            <p>We received a request to reset your Kiramart password. Click the link below to choose a new one. This link expires in 1 hour.</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>`,
        });
      } catch (error) {
        console.error('Failed to send password reset email:', error.message);
      }
    }

    return { message: 'If that email is registered, a password reset link has been sent.' };
  }

  async resetPassword(token, newPassword) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: hashedToken, resetPasswordExpires: { gt: new Date() } },
    });
    if (!user) {
      throw Object.assign(new Error('This reset link is invalid or has expired'), { statusCode: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null },
    });
    return { message: 'Password has been reset successfully' };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
  }
}

module.exports = new AuthService();
