const { prisma } = require('../config/db');
const { classifyUser } = require('../utils/helpers');

class AIService {
  async predictCategory(userId) {
    const behaviors = await prisma.userBehavior.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const features = this.extractFeatures(behaviors);
    const predictedCategory = classifyUser(behaviors);
    const confidence = this.calculateConfidence(behaviors);

    const prediction = await prisma.aiPrediction.create({
      data: {
        userId,
        clickLatency: features.avgClickLatency,
        wrongClicks: features.totalWrongClicks,
        timeSpent: features.avgTimeSpent,
        repeatedActions: features.totalRepeatedActions,
        predictedCategory,
        confidence,
      },
    });

    return { prediction, features, category: predictedCategory, confidence };
  }

  extractFeatures(behaviors) {
    if (!behaviors || behaviors.length === 0) {
      return { avgClickLatency: 0, totalWrongClicks: 0, avgTimeSpent: 0, totalRepeatedActions: 0 };
    }

    return {
      avgClickLatency: Math.round(
        behaviors.reduce((s, b) => s + (b.clickLatency || 0), 0) / behaviors.length
      ),
      totalWrongClicks: behaviors.reduce((s, b) => s + (b.wrongClicks || 0), 0),
      avgTimeSpent: Math.round(
        behaviors.reduce((s, b) => s + (b.timeSpent || 0), 0) / behaviors.length
      ),
      totalRepeatedActions: behaviors.reduce((s, b) => s + (b.repeatedActions || 0), 0),
    };
  }

  calculateConfidence(behaviors) {
    if (!behaviors || behaviors.length === 0) return 0;
    const sampleSize = Math.min(behaviors.length, 50);
    const baseConfidence = Math.min(sampleSize / 50, 1) * 0.95;
    const variance = this.calculateVariance(behaviors);
    const variancePenalty = Math.min(variance / 10000, 0.2);
    return Math.round((baseConfidence - variancePenalty) * 100) / 100;
  }

  calculateVariance(behaviors) {
    const latencies = behaviors.map((b) => b.clickLatency || 0);
    const mean = latencies.reduce((s, v) => s + v, 0) / latencies.length;
    const squaredDiffs = latencies.map((v) => (v - mean) ** 2);
    return squaredDiffs.reduce((s, v) => s + v, 0) / squaredDiffs.length;
  }

  async getPredictionHistory(userId, limit = 10) {
    return prisma.aiPrediction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

module.exports = new AIService();
