const { prisma } = require('../../config/db');

class ReportingService {
  async getUserStats() {
    const [
      totalUsers,
      usersByCategory,
      usersByRole,
      recentRegistrations,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['category'],
        _count: { id: true },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      totalUsers,
      usersByCategory: usersByCategory.map((u) => ({ category: u.category, count: u._count.id })),
      usersByRole: usersByRole.map((u) => ({ role: u.role, count: u._count.id })),
      recentRegistrations,
    };
  }

  async getBehaviorStats(query) {
    const days = parseInt(query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const behaviors = await prisma.userBehavior.findMany({
      where: { createdAt: { gte: since } },
      select: {
        clickLatency: true,
        wrongClicks: true,
        repeatedActions: true,
        timeSpent: true,
        page: true,
        createdAt: true,
      },
    });

    if (behaviors.length === 0) {
      return { totalEvents: 0, avgMetrics: {}, topPages: [], dailyTrend: [] };
    }

    const dailyMap = {};
    const pageMap = {};

    behaviors.forEach((b) => {
      const day = b.createdAt.toISOString().split('T')[0];
      dailyMap[day] = (dailyMap[day] || 0) + 1;

      if (b.page) {
        pageMap[b.page] = (pageMap[b.page] || 0) + 1;
      }
    });

    const dailyTrend = Object.entries(dailyMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topPages = Object.entries(pageMap)
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents: behaviors.length,
      avgMetrics: {
        avgClickLatency: Math.round(
          behaviors.reduce((s, b) => s + (b.clickLatency || 0), 0) / behaviors.length
        ),
        avgWrongClicks: Math.round(
          behaviors.reduce((s, b) => s + (b.wrongClicks || 0), 0) / behaviors.length
        ),
        avgRepeatedActions: Math.round(
          behaviors.reduce((s, b) => s + (b.repeatedActions || 0), 0) / behaviors.length
        ),
        avgTimeSpent: Math.round(
          behaviors.reduce((s, b) => s + (b.timeSpent || 0), 0) / behaviors.length
        ),
      },
      topPages,
      dailyTrend,
    };
  }

  async getAdaptationStats() {
    const [totalAdaptations, adaptationsByCategory] = await Promise.all([
      prisma.adaptation.count(),
      prisma.adaptation.groupBy({
        by: ['userCategory'],
        _count: { id: true },
      }),
    ]);

    return {
      totalAdaptations,
      adaptationsByCategory: adaptationsByCategory.map((a) => ({
        category: a.userCategory,
        count: a._count.id,
      })),
    };
  }

  async getProductStats() {
    const [totalProducts, productsByCategory, productStats] = await Promise.all([
      prisma.product.count(),
      prisma.product.groupBy({
        by: ['category'],
        _count: { id: true },
        _avg: { price: true },
      }),
      prisma.product.aggregate({
        _avg: { price: true },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return {
      totalProducts,
      productsByCategory: productsByCategory.map((p) => ({
        category: p.category,
        count: p._count.id,
        avgPrice: Math.round(p._avg.price * 100) / 100,
      })),
      priceRange: {
        min: productStats._min.price,
        max: productStats._max.price,
        avg: Math.round(productStats._avg.price * 100) / 100,
      },
    };
  }

  async getDashboardSummary() {
    const [userStats, behaviorStats, adaptationStats, productStats] = await Promise.all([
      this.getUserStats(),
      this.getBehaviorStats({ days: '7' }),
      this.getAdaptationStats(),
      this.getProductStats(),
    ]);

    return { userStats, behaviorStats, adaptationStats, productStats };
  }
}

module.exports = new ReportingService();
