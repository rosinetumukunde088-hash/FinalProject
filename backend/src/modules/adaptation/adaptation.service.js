const { prisma } = require('../../config/db');
const { classifyUser } = require('../../utils/helpers');

class AdaptationService {
  async getCurrentAdaptation(userId) {
    let adaptation = await prisma.adaptation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!adaptation) {
      adaptation = await prisma.adaptation.create({
        data: {
          userId,
          userCategory: 'BEGINNER',
          simplifiedLayout: true,
          kinyarwandaEnabled: true,
          audioPromptsEnabled: true,
          fontSize: 'large',
          highContrast: true,
        },
      });
    }

    return adaptation;
  }

  async analyzeAndAdapt(userId) {
    const behaviors = await prisma.userBehavior.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const category = classifyUser(behaviors);

    const config = this.getCategoryConfig(category);

    const adaptation = await prisma.adaptation.upsert({
      where: {
        id: (
          await prisma.adaptation.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
          })
        )?.id || 'none',
      },
      update: {
        userCategory: category,
        ...config,
      },
      create: {
        userId,
        userCategory: category,
        ...config,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { category },
    });

    await prisma.aiPrediction.create({
      data: {
        userId,
        clickLatency: behaviors.length > 0
          ? Math.round(behaviors.reduce((s, b) => s + (b.clickLatency || 0), 0) / behaviors.length)
          : null,
        wrongClicks: behaviors.length > 0
          ? behaviors.reduce((s, b) => s + (b.wrongClicks || 0), 0)
          : null,
        timeSpent: behaviors.length > 0
          ? Math.round(behaviors.reduce((s, b) => s + (b.timeSpent || 0), 0) / behaviors.length)
          : null,
        repeatedActions: behaviors.length > 0
          ? behaviors.reduce((s, b) => s + (b.repeatedActions || 0), 0)
          : null,
        predictedCategory: category,
        confidence: this.calculateConfidence(behaviors),
      },
    });

    return adaptation;
  }

  getCategoryConfig(category) {
    switch (category) {
      case 'BEGINNER':
        return {
          simplifiedLayout: true,
          kinyarwandaEnabled: true,
          audioPromptsEnabled: true,
          fontSize: 'large',
          highContrast: true,
        };
      case 'INTERMEDIATE':
        return {
          simplifiedLayout: true,
          kinyarwandaEnabled: true,
          audioPromptsEnabled: false,
          fontSize: 'medium',
          highContrast: false,
        };
      case 'ADVANCED':
        return {
          simplifiedLayout: false,
          kinyarwandaEnabled: false,
          audioPromptsEnabled: false,
          fontSize: 'medium',
          highContrast: false,
        };
      default:
        return {
          simplifiedLayout: true,
          kinyarwandaEnabled: true,
          audioPromptsEnabled: true,
          fontSize: 'large',
          highContrast: true,
        };
    }
  }

  calculateConfidence(behaviors) {
    if (!behaviors || behaviors.length < 3) return 0.5;
    if (behaviors.length < 10) return 0.7;
    if (behaviors.length < 30) return 0.85;
    return 0.95;
  }

  async manualOverride(userId, updates) {
    const existing = await prisma.adaptation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (existing) {
      return prisma.adaptation.update({
        where: { id: existing.id },
        data: updates,
      });
    }

    return prisma.adaptation.create({
      data: { userId, userCategory: 'BEGINNER', ...updates },
    });
  }
}

module.exports = new AdaptationService();
