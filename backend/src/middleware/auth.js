const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true, category: true, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    next(error);
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

const authorizeTrader = (req, res, next) => {
  if (req.user.role !== 'TRADER') {
    return res.status(403).json({ message: 'Trader access required' });
  }
  next();
};

const authorizeAdminOrTrader = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'TRADER') {
    return res.status(403).json({ message: 'Admin or trader access required' });
  }
  next();
};

const authorizeManager = (req, res, next) => {
  if (req.user.role !== 'MANAGER') {
    return res.status(403).json({ message: 'Manager access required' });
  }
  next();
};

const authorizeAdminOrManager = (req, res, next) => {
  if (req.user.role !== 'ADMIN' && req.user.role !== 'MANAGER') {
    return res.status(403).json({ message: 'Admin or manager access required' });
  }
  next();
};

const authorizeStoreStaff = (req, res, next) => {
  if (!['ADMIN', 'TRADER', 'MANAGER'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Staff access required' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeTrader,
  authorizeAdminOrTrader,
  authorizeManager,
  authorizeAdminOrManager,
  authorizeStoreStaff,
};
