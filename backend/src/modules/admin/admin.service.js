const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class AdminService {
  async getAllUsers(query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.role) {
      where.role = query.role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          category: true,
          phone: true,
          createdAt: true,
          _count: { select: { behaviors: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getUserDetail(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, role: true, category: true,
        phone: true, createdAt: true, updatedAt: true,
        _count: { select: { behaviors: true, adaptations: true } },
      },
    });

    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    const [recentBehaviors, adaptations, predictions] = await Promise.all([
      prisma.userBehavior.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.adaptation.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.aiPrediction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return { ...user, recentBehaviors, adaptations, predictions };
  }

  async updateUserRole(userId, role) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 });
    }

    return prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true, category: true },
    });
  }

  async logAction(adminId, action, targetId, details) {
    return prisma.adminAction.create({
      data: { adminId, action, targetId, details },
    });
  }

  async getActionLogs(query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = {};

    if (query.adminId) {
      where.adminId = query.adminId;
    }

    if (query.action) {
      where.action = query.action;
    }

    const [logs, total] = await Promise.all([
      prisma.adminAction.findMany({
        where,
        skip,
        take,
        include: {
          adminId: false,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminAction.count({ where }),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getSettings() {
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.userBehavior.count(),
      prisma.translation.count(),
      prisma.aiPrediction.count(),
    ]);

    return {
      totalUsers: stats[0],
      totalProducts: stats[1],
      totalBehaviorEvents: stats[2],
      totalTranslations: stats[3],
      totalPredictions: stats[4],
      platform: 'KiKUU Rwanda',
      middlewareVersion: '1.0.0',
    };
  }
}

module.exports = new AdminService();
