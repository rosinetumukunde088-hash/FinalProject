const classifyUser = (behaviors) => {
  if (!behaviors || behaviors.length === 0) return 'BEGINNER';

  const recent = behaviors.slice(-10);
  const avgLatency = recent.reduce((sum, b) => sum + (b.clickLatency || 0), 0) / recent.length;
  const totalWrongClicks = recent.reduce((sum, b) => sum + (b.wrongClicks || 0), 0);
  const totalRepeated = recent.reduce((sum, b) => sum + (b.repeatedActions || 0), 0);

  if (avgLatency > 5000 || totalWrongClicks > 10 || totalRepeated > 15) {
    return 'BEGINNER';
  }
  if (avgLatency > 2000 || totalWrongClicks > 5 || totalRepeated > 8) {
    return 'INTERMEDIATE';
  }
  return 'ADVANCED';
};

const paginate = (page = 1, limit = 20) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;
  return { skip, take: limitNum, page: pageNum, limit: limitNum };
};

module.exports = { classifyUser, paginate };
