const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class TranslationService {
  async translate(text, context) {
    const existing = await prisma.translation.findFirst({
      where: { sourceText: { equals: text, mode: 'insensitive' } },
    });

    if (existing) {
      return { sourceText: text, kinyarwandaText: existing.kinyarwandaText, fromCache: true };
    }

    const kinyarwandaText = await this.generateTranslation(text);
    await prisma.translation.create({
      data: { sourceText: text, kinyarwandaText, context: context || null },
    });

    return { sourceText: text, kinyarwandaText, fromCache: false };
  }

  async generateTranslation(text) {
    const dictionary = {
      'hello': 'Muraho',
      'welcome': 'Murakaza neza',
      'search': 'Shakisha',
      'products': 'Ibicuruzwa',
      'cart': 'Igikapu',
      'checkout': 'Kwishyura',
      'price': 'Igiciro',
      'add to cart': 'Ongera mu gikapu',
      'buy now': 'Gura nonaha',
      'home': 'Ahabanza',
      'categories': 'Ibyiciro',
      'about': 'Ibyerekeye',
      'contact': 'Twandikire',
      'login': 'Injira',
      'register': 'Iyandikishe',
      'logout': 'Sohoka',
      'profile': 'Ibarura',
      'settings': 'Igenamiterere',
      'save': 'Bika',
      'delete': 'Siba',
      'update': 'Vugurura',
      'cancel': 'Hagarika',
      'confirm': 'Emeza',
      'back': 'Inyuma',
      'next': 'Ikurikira',
      'submit': 'Ohereza',
      'loading': 'Birimo gupakira',
      'error': 'Ikosa',
      'success': 'Byagenze neza',
      'quantity': 'Umubare',
      'total': 'Igiteranyo',
      'payment': 'Ubwishyu',
      'delivery': 'Kugeza',
      'order': 'Itegeko',
      'my orders': 'Amategeko yanjye',
      'language': 'Ururimi',
      'kinyarwanda': 'Ikinyarwanda',
      'english': 'Icyongereza',
      'help': 'Ubufasha',
      'faq': 'Ibibazo bikunze kubazwa',
    };

    const lower = text.toLowerCase().trim();
    if (dictionary[lower]) {
      return dictionary[lower];
    }

    for (const [en, rw] of Object.entries(dictionary)) {
      if (lower.includes(en)) {
        return lower.replace(new RegExp(en, 'gi'), rw);
      }
    }

    return text;
  }

  async findAll(query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = {};

    if (query.search) {
      where.OR = [
        { sourceText: { contains: query.search, mode: 'insensitive' } },
        { kinyarwandaText: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [translations, total] = await Promise.all([
      prisma.translation.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.translation.count({ where }),
    ]);

    return {
      translations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async addTranslation(data) {
    return prisma.translation.create({ data });
  }

  async updateTranslation(id, data) {
    const existing = await prisma.translation.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error('Translation not found'), { statusCode: 404 });
    }
    return prisma.translation.update({ where: { id }, data });
  }

  async deleteTranslation(id) {
    const existing = await prisma.translation.findUnique({ where: { id } });
    if (!existing) {
      throw Object.assign(new Error('Translation not found'), { statusCode: 404 });
    }
    await prisma.translation.delete({ where: { id } });
    return { message: 'Translation deleted' };
  }
}

module.exports = new TranslationService();
