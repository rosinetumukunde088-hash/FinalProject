const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

const LANG_CODES = { en: 'en-GB', rw: 'rw', sw: 'sw-KE' };

class TranslationService {
  async translate(text, sourceLang, targetLang, context) {
    const src = LANG_CODES[sourceLang] || sourceLang;
    const tgt = LANG_CODES[targetLang] || targetLang;
    const cacheKey = `${src}:${tgt}:${text.trim().toLowerCase()}`;

    const existing = await prisma.translation.findFirst({
      where: { sourceText: { equals: text, mode: 'insensitive' } },
    });

    if (existing) {
      const fieldMap = { rw: 'kinyarwandaText', sw: 'descriptionSw', en: 'kinyarwandaText' };
      const cached = existing[fieldMap[targetLang]] || existing.kinyarwandaText;
      if (cached) {
        return { sourceText: text, translatedText: cached, fromCache: true };
      }
    }

    const translatedText = await this.fetchTranslation(text, src, tgt);

    try {
      await prisma.translation.upsert({
        where: { id: existing?.id || 'nonexistent' },
        update: { kinyarwandaText: targetLang === 'rw' ? translatedText : undefined },
        create: { sourceText: text, kinyarwandaText: targetLang === 'rw' ? translatedText : translatedText, context: context || null },
      });
    } catch {
      // Cache write failed, continue with translation
    }

    return { sourceText: text, translatedText, fromCache: false };
  }

  async fetchTranslation(text, sourceLang, targetLang) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        let result = data.responseData.translatedText;
        if (result.toUpperCase() === text.toUpperCase()) {
          return this.getFallbackTranslation(text, targetLang);
        }
        return result;
      }

      return this.getFallbackTranslation(text, targetLang);
    } catch {
      return this.getFallbackTranslation(text, targetLang);
    }
  }

  getFallbackTranslation(text, targetLang) {
    const fallbackDictionary = {
      rw: {
        'hello': 'Muraho', 'welcome': 'Murakaza neza', 'search': 'Shakisha',
        'products': 'Ibicuruzwa', 'cart': 'Igikapu', 'checkout': 'Kwishyura',
        'price': 'Igiciro', 'add to cart': 'Ongera mu gikapu', 'buy now': 'Gura nonaha',
        'home': 'Ahabanza', 'categories': 'Ibyiciro', 'about': 'Ibyerekeye',
        'contact': 'Twandikire', 'login': 'Injira', 'register': 'Iyandikishe',
        'logout': 'Sohoka', 'profile': 'Ibarura', 'settings': 'Igenamiterere',
        'save': 'Bika', 'delete': 'Siba', 'update': 'Vugurura',
        'cancel': 'Hagarika', 'confirm': 'Emeza', 'back': 'Inyuma',
        'next': 'Ikurikira', 'submit': 'Ohereza', 'loading': 'Birimo gupakira',
        'error': 'Ikosa', 'success': 'Byagenze neza', 'quantity': 'Umubare',
        'total': 'Igiteranyo', 'payment': 'Ubwishyu', 'delivery': 'Kugeza',
        'order': 'Itegeko', 'language': 'Ururimi', 'help': 'Ubufasha',
        'shipping': 'Kohereza', 'subtotal': 'Igiteranyo', 'free': 'Bworoheye',
        'stock': 'Ibicuruzwa biriho', 'description': 'Ibisobanuro',
      },
      sw: {
        'hello': 'Jambo', 'welcome': 'Karibu', 'search': 'Tafuta',
        'products': 'Bidhaa', 'cart': 'Kikapu', 'checkout': 'Lipisha',
        'price': 'Bei', 'add to cart': 'Ongeza kwenye Kikapu', 'buy now': 'Nunua Sasa',
        'home': 'Nyumbani', 'categories': 'Aina', 'about': 'Kuhusu',
        'contact': 'Wasiliana', 'login': 'Ingia', 'register': 'Jiandikishe',
        'logout': 'Ondoka', 'profile': 'Wasifu', 'settings': 'Mipangilio',
        'save': 'Hifadhi', 'delete': 'Futa', 'update': 'Sasisha',
        'cancel': 'Ghairi', 'confirm': 'Thibitisha', 'back': 'Rudi',
        'next': 'Ifuatayo', 'submit': 'Wasilisha', 'loading': 'Inapakia',
        'error': 'Hitilafu', 'success': 'Imefanikiwa', 'quantity': 'Idadi',
        'total': 'Jumla', 'payment': 'Malipo', 'delivery': 'Utoaji',
        'order': 'Agizo', 'language': 'Lugha', 'help': 'Msaada',
        'shipping': 'Usafirishaji', 'subtotal': 'Jumla ndogo', 'free': 'Bure',
        'stock': 'Hisa', 'description': 'Maelezo',
      },
    };

    const dict = fallbackDictionary[targetLang];
    if (!dict) return text;

    const lower = text.toLowerCase().trim();
    if (dict[lower]) return dict[lower];

    let result = text;
    for (const [en, translated] of Object.entries(dict)) {
      if (lower.includes(en)) {
        result = result.replace(new RegExp(en, 'gi'), translated);
      }
    }
    return result;
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
