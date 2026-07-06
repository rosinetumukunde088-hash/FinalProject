const { prisma } = require('../../config/db');

class AudioService {
  async generatePrompt(text, language = 'rw') {
    const existing = await prisma.audioPrompt.findFirst({
      where: { text: { equals: text, mode: 'insensitive' }, language },
    });

    if (existing) {
      return existing;
    }

    const audioUrl = await this.generateAudioFile(text, language);
    const prompt = await prisma.audioPrompt.create({
      data: { text, audioUrl, language },
    });

    return prompt;
  }

  async generateAudioFile(text, language) {
    const baseUrl = process.env.AUDIO_BASE_URL || '/audio';
    const filename = `prompt_${Date.now()}_${language}.mp3`;
    return `${baseUrl}/${filename}`;
  }

  async findAll(query) {
    const where = {};
    if (query.language) {
      where.language = query.language;
    }

    const prompts = await prisma.audioPrompt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(parseInt(query.limit) || 50, 100),
    });

    return prompts;
  }

  async delete(id) {
    const existing = await prisma.audioPrompt.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error('Audio prompt not found'), { statusCode: 404 });
    }
    await prisma.audioPrompt.delete({ where: { id } });
    return { message: 'Audio prompt deleted' };
  }
}

module.exports = new AudioService();
