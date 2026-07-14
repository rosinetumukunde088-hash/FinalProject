const { prisma } = require('../../config/db');

const INTENTS = {
  greeting: {
    patterns: [/^(hi|hello|hey|muraho|habari|good\s*(morning|afternoon|evening)|jambo)/i],
    response: {
      text: "Hello! Welcome to Kiramart Rwanda. I'm here to help you find products, navigate the store, or answer any questions. What can I help you with?",
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
    patterns: [/account/i, /login/i, /sign\s*in/i, /register/i, /sign\s*up/i, /profile/i, /account/i],
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

function matchIntent(message) {
  const normalized = message.trim().toLowerCase();
  
  for (const [intent, config] of Object.entries(INTENTS)) {
    for (const pattern of config.patterns) {
      if (pattern.test(normalized)) {
        return config.response;
      }
    }
  }
  
  return FALLBACK_RESPONSE;
}

class ChatbotService {
  async getResponse(message) {
    const response = matchIntent(message);
    
    let contextualAddition = '';
    
    try {
      const productCount = await prisma.product.count();
      const categories = await prisma.product.findMany({
        distinct: ['category'],
        select: { category: true }
      });
      const categoryNames = categories.map(c => c.category).join(', ');
      
      if (response === FALLBACK_RESPONSE || /product/i.test(message)) {
        contextualAddition = `\n\nWe currently have ${productCount} products available across categories: ${categoryNames}.`;
      }
    } catch (error) {
      // Database not available, continue without context
    }

    return {
      ...response,
      text: response.text + contextualAddition
    };
  }
}

module.exports = new ChatbotService();
