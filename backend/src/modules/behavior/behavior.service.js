const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class BehaviorService {
  async track(userId, data) {
    return prisma.userBehavior.create({
      data: {
        userId,
        clickLatency: data.clickLatency || null,
        wrongClicks: data.wrongClicks || null,
        timeSpent: data.timeSpent || null,
        repeatedActions: data.repeatedActions || null,
        navigationPattern: data.navigationPattern || null,
        page: data.page || null,
        deviceInfo: data.deviceInfo || null,
      },
    });
  }

  async getUserBehaviors(userId, query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = { userId };

    if (query.from) {
      where.createdAt = { ...where.createdAt, gte: new Date(query.from) };
    }
    if (query.to) {
      where.createdAt = { ...where.createdAt, lte: new Date(query.to) };
    }

    const [behaviors, total] = await Promise.all([
      prisma.userBehavior.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.userBehavior.count({ where }),
    ]);

    return {
      behaviors,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getSummary(userId) {
    const behaviors = await prisma.userBehavior.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    if (behaviors.length === 0) {
      return {
        totalSessions: 0,
        avgClickLatency: 0,
        totalWrongClicks: 0,
        totalRepeatedActions: 0,
        avgTimeSpent: 0,
      };
    }

    return {
      totalSessions: behaviors.length,
      avgClickLatency: Math.round(
        behaviors.reduce((s, b) => s + (b.clickLatency || 0), 0) / behaviors.length
      ),
      totalWrongClicks: behaviors.reduce((s, b) => s + (b.wrongClicks || 0), 0),
      totalRepeatedActions: behaviors.reduce((s, b) => s + (b.repeatedActions || 0), 0),
      avgTimeSpent: Math.round(
        behaviors.reduce((s, b) => s + (b.timeSpent || 0), 0) / behaviors.length
      ),
    };
  }
}

module.exports = new BehaviorService();
