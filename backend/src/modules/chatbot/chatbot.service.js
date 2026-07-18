const { prisma } = require('../../config/db');

const INTENTS = {
  greeting: {
    patterns: [/^(hi|hello|hey|muraho|habari|good\s*(morning|afternoon|evening)|jambo)/i],
    response: {
      text: "Hello! Welcome to Kiramart Rwanda. I'm here to help you find products, simplify the interface, navigate the store, or answer any questions. What can I help you with?",
      link: null,
      suggestions: ["Browse products", "Help me find something", "About Kiramart"]
    }
  },
  browse_products: {
    patterns: [/product/i, /shop/i, /buy/i, /browse/i, /item/i, /catalog/i, /store/i, /shopping/i],
    response: {
      text: "We have a wide selection of products! Browse our full catalog to find what you're looking for.",
      link: { text: "Go to Products", path: "/products" },
      suggestions: ["Search by category", "View cart", "Help me find something"]
    }
  },
  view_cart: {
    patterns: [/cart/i, /basket/i, /checkout/i, /my\s*order/i, /purchase/i],
    response: {
      text: "Ready to review your cart? You can view all items, update quantities, and proceed to checkout.",
      link: { text: "Go to Cart", path: "/cart" },
      suggestions: ["Continue shopping", "Help me find something"]
    }
  },
  categories: {
    patterns: [/category/i, /categories/i, /type/i, /kind/i, /what\s*(do|does).*sell/i, /what.*available/i],
    response: {
      text: "We have various product categories. Check them out and find exactly what you need!",
      link: { text: "Browse by Category", path: "/products" },
      suggestions: ["Help me find something", "About Kiramart"]
    }
  },
  account: {
    patterns: [/account/i, /login/i, /sign\s*in/i, /register/i, /sign\s*up/i, /profile/i],
    response: {
      text: "You can sign in to access your account, or register if you're new to Kiramart Rwanda.",
      link: { text: "Sign In", path: "/login" },
      suggestions: ["Register account", "Browse products"]
    }
  },
  register: {
    patterns: [/register/i, /sign\s*up/i, /create\s*account/i, /new\s*account/i, /join/i],
    response: {
      text: "Creating an account is quick and easy! You'll get access to personalized recommendations and order history.",
      link: { text: "Create Account", path: "/register" },
      suggestions: ["Sign in instead", "Browse products"]
    }
  },
  about: {
    patterns: [/about/i, /what\s*is/i, /tell\s*me\s*about/i, /kiramart/i, /who\s*are\s*you/i, /what\s*is\s*this/i],
    response: {
      text: "Kiramart Rwanda is an AI-powered e-commerce platform built for Rwandan users. We offer adaptive UI, Kinyarwanda language support, and a personalized shopping experience. Our platform uses AI to simplify the interface for beginners and adapt to each user's skill level.",
      link: { text: "Go to Home", path: "/" },
      suggestions: ["Browse products", "Help me find something"]
    }
  },
  help: {
    patterns: [/help/i, /assist/i, /support/i, /how\s*(do|does|to)/i, /what\s*can\s*you/i, /guide/i],
    response: {
      text: "I can help you with:\n- Finding products and categories\n- Navigating the store\n- Managing your cart\n- Account registration and login\n- Understanding Kiramart features\n\nJust ask me anything!",
      link: null,
      suggestions: ["Browse products", "About Kiramart", "View cart"]
    }
  },
  adaptation: {
    patterns: [/simplif|easy|larger|contrast|interface|layout|adapt/i],
    response: {
      text: "I can help you make the interface easier to use. Tell me whether you prefer larger buttons, simpler menus, more contrast, or more guidance and I will point you to the right experience.",
      link: { text: "Go to Home", path: "/" },
      suggestions: ["Show me products", "Open my cart", "Help me sign in"]
    }
  },
  kinyarwanda: {
    patterns: [/kinyarwanda/i, /rwandan/i, /local/i, /language/i, /muraho/i, /rwanda/i, /kinyarwanda\s*support/i],
    response: {
      text: "We proudly support Kinyarwanda! All product descriptions are available in both English and Kinyarwanda. Our platform adapts to show Kinyarwanda first for users who prefer it.",
      link: { text: "Browse Products", path: "/products" },
      suggestions: ["About Kiramart", "Help me find something"]
    }
  },
  ai_features: {
    patterns: [/ai/i, /artificial\s*intelligence/i, /adaptive/i, /personaliz/i, /smart/i, /machine\s*learning/i, /behavior/i],
    response: {
      text: "Our AI system tracks your behavior to adapt the UI to your skill level. Beginners get a simplified layout with larger buttons and Kinyarwanda prompts. Advanced users see the full interface. The AI continuously learns from your interactions!",
      link: { text: "Go to Home", path: "/" },
      suggestions: ["Browse products", "About Kiramart"]
    }
  },
  delivery: {
    patterns: [/deliver/i, /shipping/i, /ship/i, /transport/i, /arrive/i, /how\s*long/i, /time/i, /when/i],
    response: {
      text: "We deliver across Rwanda! Standard delivery takes 1-3 business days depending on your location. Delivery is free for all orders.",
      link: { text: "Browse Products", path: "/products" },
      suggestions: ["View cart", "Help me find something"]
    }
  },
  payment: {
    patterns: [/pay/i, /payment/i, /money/i, /cash/i, /momo/i, /m-pesa/i, /mobile\s*money/i, /card/i, /visa/i],
    response: {
      text: "We accept various payment methods including Mobile Money (MTN MoMo, Airtel Money), bank transfers, and cash on delivery. All payments are secure.",
      link: { text: "View Cart", path: "/cart" },
      suggestions: ["Browse products", "Help me find something"]
    }
  },
  returns: {
    patterns: [/return/i, /refund/i, /exchange/i, /cancel/i, /wrong/i, /broken/i, /defect/i],
    response: {
      text: "We have a hassle-free return policy. If you're not satisfied with your purchase, you can return it within 7 days for a full refund or exchange.",
      link: { text: "Go to Home", path: "/" },
      suggestions: ["Browse products", "Help me find something"]
    }
  },
  price: {
    patterns: [/price/i, /cost/i, /cheap/i, /expensive/i, /afford/i, /budget/i, /how\s*much/i, /rwf/i],
    response: {
      text: "Our products range from affordable everyday items to premium products, all priced in Rwandan Francs (RWF). Use the search and filter features to find products in your budget!",
      link: { text: "Browse Products", path: "/products" },
      suggestions: ["Search by category", "View cart"]
    }
  },
  stock: {
    patterns: [/stock/i, /available/i, /out\s*of/i, /sold\s*out/i, /in\s*stock/i, /quantity/i],
    response: {
      text: "You can check stock availability on each product's detail page. We update inventory in real-time so you always know what's available.",
      link: { text: "Browse Products", path: "/products" },
      suggestions: ["Help me find something", "View cart"]
    }
  },
  search: {
    patterns: [/search/i, /find/i, /looking\s*for/i, /where/i, /locate/i, /specific/i],
    response: {
      text: "Use the search bar on our Products page to find specific items. You can also filter by category to narrow down results.",
      link: { text: "Search Products", path: "/products" },
      suggestions: ["Browse categories", "View cart"]
    }
  },
  thank_you: {
    patterns: [/thank/i, /thanks/i, /murakoze/i, /appreciate/i, /great/i, /perfect/i, /awesome/i],
    response: {
      text: "You're welcome! I'm always here to help. Happy shopping on Kiramart Rwanda!",
      link: { text: "Continue Shopping", path: "/products" },
      suggestions: ["Browse products", "View cart"]
    }
  },
  goodbye: {
    patterns: [/bye/i, /goodbye/i, /see\s*you/i, /later/i, /exit/i, /quit/i],
    response: {
      text: "Goodbye! Thank you for visiting Kiramart Rwanda. See you again soon!",
      link: { text: "Go to Home", path: "/" },
      suggestions: ["Browse products"]
    }
  }
};

const FALLBACK_RESPONSE = {
  text: "I'm not sure I understand that. I can help you with browsing products, managing your cart, account questions, or anything about Kiramart Rwanda. What would you like to know?",
  link: { text: "Go to Home", path: "/" },
  suggestions: ["Browse products", "Help me find something", "About Kiramart"]
};

const LANGUAGE_NAMES = {
  en: ['english', 'icyongereza', 'kiingereza'],
  rw: ['kinyarwanda', 'ikinyarwanda'],
  sw: ['kiswahili', 'swahili'],
};

// Explicit "switch/change" verbs — strong enough signal on their own once a
// language name is also present in the message.
const SWITCH_VERBS = /\b(change|switch|set|turn\s*on|turn\s*off|enable|activate|hindura|hindukanya|badilisha|geuza)\b/i;

// Softer "go to / put it in" style verbs (e.g. "jya mu Kinyarwanda") — only
// treated as a language-switch when paired with an explicit language name,
// since on their own they're too generic (e.g. "jya" = "go").
const GO_TO_VERBS = /\b(jya|genda|shyira|gira|koresha|tumia|weka|fanya)\b/i;

const IN_LANGUAGE_PATTERN = /\b(in|to|into)\s+(english|kinyarwanda|ikinyarwanda|icyongereza|kiingereza|kiswahili|swahili)\b/i;
const MODE_PATTERN = /\b(english|kinyarwanda|ikinyarwanda|icyongereza|kiingereza|kiswahili|swahili)\s+mode\b/i;

// "language" itself, in each supported language — used to confirm intent when
// no target language is named (e.g. "hindura ururimi" = "change the language").
const LANGUAGE_NOUN = /\b(language|ururimi|ikirimi|lugha)\b/i;
const RW_MARKERS = /\b(hindura|hindukanya|ururimi|ikirimi|jya|genda)\b/i;
const SW_MARKERS = /\b(badilisha|lugha|tumia|weka|fanya)\b/i;

const LANGUAGE_SWITCH_RESPONSES = {
  en: {
    text: "Done! I've switched the whole system to English.",
    suggestions: ["Browse products", "View cart", "Help"],
  },
  rw: {
    text: "Byakozwe! Nahinduye ururimi rw'ikoranabuhanga ryose mu Kinyarwanda.",
    suggestions: ["Reba ibicuruzwa", "Reba igikapu", "Ubufasha"],
  },
  sw: {
    text: "Nimefanya! Nimebadilisha lugha ya mfumo mzima kuwa Kiswahili.",
    suggestions: ["Tazama bidhaa", "Tazama kikapu", "Msaada"],
  },
};

// General vocabulary used to recognize which language an ordinary message is
// written in (as opposed to SWITCH_VERBS/GO_TO_VERBS above, which only detect
// an explicit "change the language" command). Any message sent to the AI —
// not just explicit switch commands — uses this to keep the whole site's
// language in sync with whatever language the user is typing in.
const RW_LANG_WORDS = /\b(muraho|mwaramutse|amakuru|murakoze|ndabizi|sinzi|yego|oya|ndashaka|nshaka|mfasha|ndagira|ese|cyangwa|kandi|ariko|ntabwo|ibicuruzwa|igicuruzwa|akabari|ikirimi|ururimi|urubuga|kugura|gucuruza|amafaranga|nkunda|nifuza|nkeneye|ndashimira|neza|byiza|hindura|umukiriya|umuguzi|iyi|aha|hano|gute|ryari|kuki|witwa|nitwa)\b/i;
const SW_LANG_WORDS = /\b(habari|jambo|asante|karibu|tafadhali|ninahitaji|nataka|naomba|ndiyo|hapana|sawa|bidhaa|nunua|pesa|lugha|msaada|samahani|kwaheri|mimi|wewe|sisi|badilisha|nzuri|vizuri|rafiki|ninaweza|unaweza|gharama|duka|wapi|lini|leo|kesho)\b/i;
const EN_LANG_WORDS = /\b(hello|hi|hey|please|thanks|thank|want|need|show|help|find|looking|cart|product|products|buy|price|order|account|login|sign|register|good|morning|afternoon|evening|what|how|where|when|could|would|your|does)\b/i;

const LANG_DISPLAY_NAME = { en: 'English', rw: 'Kinyarwanda', sw: 'Swahili' };

function countMatches(regex, text) {
  const matches = text.match(new RegExp(regex.source, 'gi'));
  return matches ? matches.length : 0;
}

function detectMessageLanguage(message) {
  const normalized = message.trim().toLowerCase();
  if (!normalized) return null;

  const scores = {
    rw: countMatches(RW_LANG_WORDS, normalized),
    sw: countMatches(SW_LANG_WORDS, normalized),
    en: countMatches(EN_LANG_WORDS, normalized),
  };

  const [bestLang, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return bestScore > 0 ? bestLang : null;
}

function detectLanguageSwitch(message) {
  const normalized = message.trim().toLowerCase();

  let explicitLang = null;
  for (const [code, names] of Object.entries(LANGUAGE_NAMES)) {
    if (names.some((name) => normalized.includes(name))) {
      explicitLang = code;
      break;
    }
  }

  if (explicitLang) {
    const hasIntent =
      SWITCH_VERBS.test(normalized) ||
      GO_TO_VERBS.test(normalized) ||
      IN_LANGUAGE_PATTERN.test(normalized) ||
      MODE_PATTERN.test(normalized);
    return hasIntent ? explicitLang : null;
  }

  // No language named — e.g. "hindura ururimi" ("change the language"). Only act
  // if there's a clear switch verb plus the word "language" itself, then infer
  // the target from which language the request is written in.
  if (SWITCH_VERBS.test(normalized) && LANGUAGE_NOUN.test(normalized)) {
    if (RW_MARKERS.test(normalized)) return 'rw';
    if (SW_MARKERS.test(normalized)) return 'sw';
    return 'en';
  }

  return null;
}

function matchIntent(message) {
  const normalized = message.trim().toLowerCase();

  for (const [, config] of Object.entries(INTENTS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalized)) {
        return config.response;
      }
    }
  }

  return FALLBACK_RESPONSE;
}

function inferRoute(message) {
  const normalized = message.trim().toLowerCase();

  if (/cart|basket|checkout|order|buy/i.test(normalized)) {
    return { path: '/cart', label: 'Open cart', suggestion: 'View cart' };
  }
  if (/product|shop|browse|catalog|store|search/i.test(normalized)) {
    return { path: '/products', label: 'Open products', suggestion: 'Browse products' };
  }
  if (/profile|account|sign in|login|register|create account/i.test(normalized)) {
    return { path: '/login', label: 'Open login', suggestion: 'Sign in' };
  }
  if (/admin|dashboard|manage/i.test(normalized)) {
    return { path: '/admin', label: 'Open admin', suggestion: 'Go to admin' };
  }
  if (/home|welcome|start/i.test(normalized)) {
    return { path: '/', label: 'Go home', suggestion: 'Go to home' };
  }
  return null;
}

async function askGroq(message, langCode) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const languageInstruction = langCode && LANG_DISPLAY_NAME[langCode]
    ? ` Always reply in ${LANG_DISPLAY_NAME[langCode]}, the same language the user just wrote in.`
    : '';

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Kiramart AI, a helpful assistant for an e-commerce app in Rwanda. Help users browse products, understand the system, and simplify the interface. Keep replies concise and useful. If the user asks for an action, mention the most relevant page in one short sentence.${languageInstruction}`
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 220,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq error ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    return null;
  }
}

class ChatbotService {
  async getResponse(message, source = 'typed') {
    const langSwitch = detectLanguageSwitch(message);
    if (langSwitch) {
      const langResponse = LANGUAGE_SWITCH_RESPONSES[langSwitch];
      return {
        text: langResponse.text,
        link: null,
        suggestions: langResponse.suggestions,
        action: { type: 'setLanguage', lang: langSwitch },
      };
    }

    // Only infer the ambient language from messages the user actually typed —
    // canned suggestion chips are always in English regardless of the site's
    // current language, so clicking one shouldn't silently switch it back.
    const detectedLang = source === 'suggestion' ? null : detectMessageLanguage(message);

    const response = matchIntent(message);
    const route = inferRoute(message);
    let contextualAddition = '';
    let finalText = response.text;

    try {
      const productCount = await prisma.product.count();
      const categories = await prisma.product.findMany({
        distinct: ['category'],
        select: { category: true }
      });
      const categoryNames = categories.map((c) => c.category).join(', ');

      if (response === FALLBACK_RESPONSE || /product/i.test(message)) {
        contextualAddition = `\n\nWe currently have ${productCount} products available across categories: ${categoryNames}.`;
      }
    } catch (error) {
      // Database not available, continue without context
    }

    const groqReply = await askGroq(message, detectedLang);
    if (groqReply) {
      finalText = groqReply;
    }

    const link = route ? { text: route.label, path: route.path } : response.link;
    const suggestions = [...new Set([...(route ? [route.suggestion] : []), ...(response.suggestions || [])])];

    return {
      text: `${finalText}${contextualAddition}`.trim(),
      link,
      suggestions: suggestions.slice(0, 4),
      action: detectedLang ? { type: 'setLanguage', lang: detectedLang } : null,
    };
  }
}

module.exports = new ChatbotService();
