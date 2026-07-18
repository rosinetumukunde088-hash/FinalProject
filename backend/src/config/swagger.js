const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AI-Assisted UI/UX Generation Middleware - Kiramart Rwanda',
    version: '1.0.0',
    description: `API documentation for the AI-Assisted UI/UX Generation Middleware for Locally Tailored Kinyarwanda E-Commerce Platforms.

**Case Study:** Kiramart Rwanda

---

### How the Dynamic UI Works

This middleware provides an adaptive e-commerce experience that automatically adjusts the interface based on each user's skill level. The system follows a continuous feedback loop:

**1. Behavior Tracking**
As users browse products, click buttons, and navigate the store, the middleware silently records interaction metrics: click latency (how long to click), wrong clicks, time spent on pages, repeated actions, and navigation patterns. This data is collected via \`POST /behavior/track\` by the frontend.

**2. AI User Classification**
Using the collected behavior data, the AI engine (\`POST /ai/predict\` or \`POST /adaptation/analyze\`) classifies each user into one of three categories:
- **BEGINNER** — New or struggling users: slow clicks, many wrong clicks, repeated actions
- **INTERMEDIATE** — Developing users: moderate interaction speed, occasional errors
- **ADVANCED** — Power users: fast, accurate navigation with minimal errors

**3. Dynamic Interface Adaptation**
Based on the predicted category, the middleware generates an adaptation profile that the frontend applies in real-time:
- **BEGINNER:** Simplified layout, Kinyarwanda language enabled, audio prompts enabled, large font size, high contrast mode
- **INTERMEDIATE:** Simplified layout, Kinyarwanda enabled, medium font, standard contrast
- **ADVANCED:** Full layout, English interface, medium font, standard contrast

**4. User Override**
Users can manually adjust their adaptation settings at any time via \`PUT /adaptation/override\` (e.g., switch language, toggle audio prompts, change font size).

---

### Supporting Features
- **Translations:** English-to-Kinyarwanda dictionary for UI strings (\`POST /translations/translate\`)
- **Audio Prompts:** Accessibility audio guidance for key actions (\`POST /audio/generate\`)
- **Admin Dashboard:** Analytics on user distribution, behavior trends, and adaptation statistics
- **Product Catalog:** Full CRUD for e-commerce products with search, filter, and pagination

---

### User Roles

| Role | Description | Access |
|------|-------------|--------|
| **USER** | Standard customer. Automatically assigned on registration. | Browse products, track own behavior, receive adaptive UI, manage own profile |
| **ADMIN** | Platform administrator. Manually assigned. | All USER permissions + manage products, translations, audio prompts, view reports, manage users |`,
    contact: {
      name: 'Kiramart Rwanda Development Team',
      email: 'dev@kiramart.rw',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User registration, login, and profile management. Register and login are public; profile requires authentication.' },
    { name: 'Products', description: 'Product catalog browsing and management. Listing, search, categories, and detail are public. Create, update, delete require ADMIN role.' },
    { name: 'Behavior', description: 'User interaction behavior tracking. Requires authentication. Users can only track and view their own behavior data.' },
    { name: 'Adaptation', description: 'AI-driven interface adaptation engine. Requires authentication. Users manage their own adaptation settings.' },
    { name: 'Translations', description: 'English to Kinyarwanda translation services. Translate endpoint requires auth. List, add, update, delete translations require ADMIN role.' },
    { name: 'Audio', description: 'Audio prompt generation for accessibility. List requires auth. Generate and delete require ADMIN role.' },
    { name: 'AI Engine', description: 'AI prediction and user classification. Requires authentication. Users can only predict and view their own classification.' },
    { name: 'Reports', description: 'Administrative analytics and reporting. All report endpoints require ADMIN role.' },
    { name: 'Admin', description: 'User management and system administration. All admin endpoints require ADMIN role.' },
    { name: 'Upload', description: 'File upload to local storage (images and audio). Requires ADMIN role.' },
    { name: 'System', description: 'Health check and system status. Public endpoint, no authentication required.' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT token from login/register. USER role: standard access. ADMIN role: full platform access including product management, reports, and user administration.',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Error description' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                msg: { type: 'string', example: 'Name is required' },
                param: { type: 'string', example: 'name' },
                location: { type: 'string', example: 'body' },
              },
            },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Jean Baptiste Habimana' },
          email: { type: 'string', format: 'email', example: 'habimana@example.com' },
          password: { type: 'string', format: 'password', example: 'securepass123' },
          phone: { type: 'string', example: '+250788123456' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'habimana@example.com' },
          password: { type: 'string', format: 'password', example: 'securepass123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
              name: { type: 'string', example: 'Jean Baptiste Habimana' },
              email: { type: 'string', example: 'habimana@example.com' },
              role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'User role: USER (customer, default) or ADMIN (platform administrator)', example: 'USER' },
              category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'AI-predicted skill level: BEGINNER (new/struggling), INTERMEDIATE (developing), ADVANCED (power user)', example: 'BEGINNER' },
              phone: { type: 'string', example: '+250788123456' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
      },
      UserProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          name: { type: 'string', example: 'Jean Baptiste Habimana' },
          email: { type: 'string', example: 'habimana@example.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'USER = customer (default), ADMIN = platform administrator', example: 'USER' },
          category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'AI-predicted skill level that drives UI adaptation', example: 'BEGINNER' },
          phone: { type: 'string', example: '+250788123456' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          adaptations: {
            type: 'array',
            items: { $ref: '#/components/schemas/Adaptation' },
            description: 'Most recent adaptation settings (limited to 1)',
          },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1b2c3d4e5f6g7h8i9j0k1l' },
          name: { type: 'string', example: 'Agaseke - Panier Traditionnel' },
          nameRw: { type: 'string', example: 'Agaseke' },
          description: { type: 'string', example: 'Panier traditionnel rwandais tissé à la main, fabriqué par des artisans locaux' },
          descriptionRw: { type: 'string', example: 'Agaseke gakozwe n\'intoki n\'abanyarwanda' },
          price: { type: 'number', example: 25000 },
          category: { type: 'string', example: 'Artisanat' },
          imageUrl: { type: 'string', example: '/images/agaseke.jpg' },
          stock: { type: 'integer', example: 50 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ProductInput: {
        type: 'object',
        required: ['name', 'description', 'price', 'category'],
        properties: {
          name: { type: 'string', example: 'Agaseke - Panier Traditionnel' },
          nameRw: { type: 'string', example: 'Agaseke' },
          description: { type: 'string', example: 'Panier traditionnel rwandais tissé à la main' },
          descriptionRw: { type: 'string', example: 'Agaseke gakozwe n\'intoki' },
          price: { type: 'number', example: 25000 },
          category: { type: 'string', example: 'Artisanat' },
          imageUrl: { type: 'string', example: '/images/agaseke.jpg' },
          stock: { type: 'integer', example: 50 },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 20 },
          total: { type: 'integer', example: 45 },
          pages: { type: 'integer', example: 3 },
        },
      },
      ProductListResponse: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: { $ref: '#/components/schemas/Product' },
          },
          pagination: { $ref: '#/components/schemas/Pagination' },
        },
      },
      UserBehavior: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1x2y3z4a5b6c7d8e9f0g1h' },
          userId: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          clickLatency: { type: 'integer', nullable: true, example: 3200, description: 'Time between click and response in ms' },
          wrongClicks: { type: 'integer', nullable: true, example: 3, description: 'Number of incorrect clicks' },
          timeSpent: { type: 'integer', nullable: true, example: 45000, description: 'Time spent on page in ms' },
          repeatedActions: { type: 'integer', nullable: true, example: 5, description: 'Count of repeated actions' },
          navigationPattern: { type: 'string', nullable: true, example: 'home > products > search > product_detail' },
          page: { type: 'string', nullable: true, example: '/products/artisanat' },
          deviceInfo: { type: 'string', nullable: true, example: 'Mozilla/5.0 (Linux; Android 12; Samsung Galaxy A13)' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      TrackBehaviorInput: {
        type: 'object',
        properties: {
          clickLatency: { type: 'integer', description: 'Time between click and response in ms', example: 3200 },
          wrongClicks: { type: 'integer', description: 'Number of incorrect clicks', example: 3 },
          timeSpent: { type: 'integer', description: 'Time spent on page in ms', example: 45000 },
          repeatedActions: { type: 'integer', description: 'Count of repeated actions', example: 5 },
          navigationPattern: { type: 'string', description: 'Navigation flow pattern', example: 'home > products > search > product_detail' },
          page: { type: 'string', description: 'Current page', example: '/products/artisanat' },
          deviceInfo: { type: 'string', description: 'Device information', example: 'Mozilla/5.0 (Linux; Android 12; Samsung Galaxy A13)' },
        },
      },
      BehaviorSummary: {
        type: 'object',
        properties: {
          totalSessions: { type: 'integer', example: 12 },
          avgClickLatency: { type: 'integer', example: 2800 },
          totalWrongClicks: { type: 'integer', example: 8 },
          totalRepeatedActions: { type: 'integer', example: 15 },
          avgTimeSpent: { type: 'integer', example: 32000 },
        },
      },
      Adaptation: {
        type: 'object',
        description: 'UI adaptation profile generated by AI based on user behavior classification. Controls layout, language, audio, font, and contrast settings.',
        properties: {
          id: { type: 'string', example: 'clv1c2d3e4f5g6h7i8j9k0l1m' },
          userId: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          userCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'BEGINNER: full accessibility (simplified layout, Kinyarwanda, audio, large font, high contrast). INTERMEDIATE: partial (simplified layout, Kinyarwanda, medium font). ADVANCED: minimal (standard layout, English, medium font).', example: 'BEGINNER' },
          simplifiedLayout: { type: 'boolean', description: 'Reduces UI complexity for beginners (fewer elements, larger buttons)', example: true },
          kinyarwandaEnabled: { type: 'boolean', description: 'Switches UI language to Kinyarwanda', example: true },
          audioPromptsEnabled: { type: 'boolean', description: 'Enables spoken guidance for navigation and actions', example: true },
          fontSize: { type: 'string', enum: ['large', 'medium'], description: 'large = BEGINNER default, medium = INTERMEDIATE/ADVANCED default', example: 'large' },
          highContrast: { type: 'boolean', description: 'Increases color contrast for better visibility', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AdaptationOverride: {
        type: 'object',
        description: 'Manual override for adaptation settings. Users can adjust any field independent of their AI-predicted category.',
        properties: {
          userCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'Override the AI-predicted skill level', example: 'INTERMEDIATE' },
          simplifiedLayout: { type: 'boolean', description: 'Toggle simplified vs full layout', example: false },
          kinyarwandaEnabled: { type: 'boolean', description: 'Toggle Kinyarwanda language', example: true },
          audioPromptsEnabled: { type: 'boolean', description: 'Toggle audio navigation prompts', example: false },
          fontSize: { type: 'string', enum: ['large', 'medium'], description: 'Toggle font size', example: 'medium' },
          highContrast: { type: 'boolean', description: 'Toggle high contrast mode', example: false },
        },
      },
      TranslationInput: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', example: 'Welcome to Kiramart Rwanda' },
          context: { type: 'string', example: 'homepage_header' },
        },
      },
      TranslationCreateInput: {
        type: 'object',
        required: ['sourceText', 'kinyarwandaText'],
        properties: {
          sourceText: { type: 'string', example: 'Thank you' },
          kinyarwandaText: { type: 'string', example: 'Murakoze' },
          context: { type: 'string', example: 'general' },
        },
      },
      TranslationUpdateInput: {
        type: 'object',
        properties: {
          sourceText: { type: 'string', example: 'Thank you very much' },
          kinyarwandaText: { type: 'string', example: 'Murakoze cyane' },
          context: { type: 'string', example: 'general' },
        },
      },
      TranslationResponse: {
        type: 'object',
        properties: {
          sourceText: { type: 'string', example: 'Welcome to Kiramart Rwanda' },
          kinyarwandaText: { type: 'string', example: 'Murakaza neza kuri Kiramart Rwanda' },
          fromCache: { type: 'boolean', example: true },
        },
      },
      Translation: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1t2r3a4n5s6l7a8t9i0o1n' },
          sourceText: { type: 'string', example: 'Welcome' },
          kinyarwandaText: { type: 'string', example: 'Murakaza neza' },
          context: { type: 'string', nullable: true, example: 'homepage' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AudioPromptInput: {
        type: 'object',
        required: ['text'],
        properties: {
          text: { type: 'string', example: 'Kanda hano urebe ibicuruzwa' },
          language: { type: 'string', enum: ['rw', 'en', 'fr'], example: 'rw' },
        },
      },
      AudioPrompt: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1a2u3d4i5o6p7r8o9m0p1t' },
          text: { type: 'string', example: 'Kanda hano urebe ibicuruzwa' },
          audioUrl: { type: 'string', nullable: true, example: '/audio/prompt_1700000000_rw.mp3' },
          language: { type: 'string', example: 'rw' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AiPrediction: {
        type: 'object',
        description: 'AI prediction record storing the classified user category and confidence score based on behavior analysis.',
        properties: {
          id: { type: 'string', example: 'clv1p2r3e4d5i6c7t8i9o0n1a' },
          userId: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          clickLatency: { type: 'integer', nullable: true, description: 'Average click latency used for prediction (ms)', example: 3200 },
          wrongClicks: { type: 'integer', nullable: true, description: 'Total wrong clicks used for prediction', example: 3 },
          timeSpent: { type: 'integer', nullable: true, description: 'Average time spent on page used for prediction (ms)', example: 45000 },
          repeatedActions: { type: 'integer', nullable: true, description: 'Total repeated actions used for prediction', example: 5 },
          predictedCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'BEGINNER: high friction, INTERMEDIATE: moderate friction, ADVANCED: smooth navigation', example: 'BEGINNER' },
          confidence: { type: 'number', nullable: true, description: 'Prediction confidence 0.0-1.0 (higher = more confident, based on sample size)', example: 0.85 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AiPredictionResponse: {
        type: 'object',
        properties: {
          prediction: { $ref: '#/components/schemas/AiPrediction' },
          features: {
            type: 'object',
            properties: {
              avgClickLatency: { type: 'integer', example: 3200 },
              totalWrongClicks: { type: 'integer', example: 3 },
              avgTimeSpent: { type: 'integer', example: 45000 },
              totalRepeatedActions: { type: 'integer', example: 5 },
            },
          },
          category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], example: 'BEGINNER' },
          confidence: { type: 'number', example: 0.85 },
        },
      },
      AdminAction: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1a2d3m4i5n6a7c8t9i0o1n' },
          adminId: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          action: { type: 'string', example: 'UPDATE_ROLE' },
          targetId: { type: 'string', nullable: true, example: 'clv1x2y3z4a5b6c7d8e9f0g1h' },
          details: { type: 'string', nullable: true, example: 'Role changed to ADMIN' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AdminUserListItem: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          name: { type: 'string', example: 'Jean Baptiste Habimana' },
          email: { type: 'string', example: 'habimana@example.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'USER = customer, ADMIN = platform administrator', example: 'USER' },
          category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'AI-predicted skill level', example: 'BEGINNER' },
          phone: { type: 'string', nullable: true, example: '+250788123456' },
          createdAt: { type: 'string', format: 'date-time' },
          _count: {
            type: 'object',
            properties: {
              behaviors: { type: 'integer', example: 25 },
            },
          },
        },
      },
      AdminUserDetail: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          name: { type: 'string', example: 'Jean Baptiste Habimana' },
          email: { type: 'string', example: 'habimana@example.com' },
          role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'USER = customer, ADMIN = platform administrator', example: 'USER' },
          category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'AI-predicted skill level that drives UI adaptation', example: 'BEGINNER' },
          phone: { type: 'string', nullable: true, example: '+250788123456' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          _count: {
            type: 'object',
            properties: {
              behaviors: { type: 'integer', example: 25 },
              adaptations: { type: 'integer', example: 3 },
            },
          },
          recentBehaviors: {
            type: 'array',
            items: { $ref: '#/components/schemas/UserBehavior' },
            description: 'Last 20 behavior records',
          },
          adaptations: {
            type: 'array',
            items: { $ref: '#/components/schemas/Adaptation' },
          },
          predictions: {
            type: 'array',
            items: { $ref: '#/components/schemas/AiPrediction' },
            description: 'Last 10 AI predictions',
          },
        },
      },
      AdminSettings: {
        type: 'object',
        properties: {
          totalUsers: { type: 'integer', example: 150 },
          totalProducts: { type: 'integer', example: 45 },
          totalBehaviorEvents: { type: 'integer', example: 12500 },
          totalTranslations: { type: 'integer', example: 320 },
          totalPredictions: { type: 'integer', example: 850 },
          platform: { type: 'string', example: 'Kiramart Rwanda' },
          middlewareVersion: { type: 'string', example: '1.0.0' },
        },
      },
      UploadResponse: {
        type: 'object',
        properties: {
          url: { type: 'string', example: '/uploads/1737200000000-a1b2c3d4e5f6g7h8.jpg' },
        },
      },
      UserStatsReport: {
        type: 'object',
        properties: {
          totalUsers: { type: 'integer', example: 150 },
          usersByCategory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                category: { type: 'string', example: 'BEGINNER' },
                count: { type: 'integer', example: 85 },
              },
            },
          },
          usersByRole: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                role: { type: 'string', example: 'USER' },
                count: { type: 'integer', example: 145 },
              },
            },
          },
          recentRegistrations: { type: 'integer', example: 23 },
        },
      },
      BehaviorStatsReport: {
        type: 'object',
        properties: {
          totalEvents: { type: 'integer', example: 1250 },
          avgMetrics: {
            type: 'object',
            properties: {
              avgClickLatency: { type: 'integer', example: 2850 },
              avgWrongClicks: { type: 'integer', example: 2 },
              avgRepeatedActions: { type: 'integer', example: 4 },
              avgTimeSpent: { type: 'integer', example: 35000 },
            },
          },
          topPages: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                page: { type: 'string', example: '/products/artisanat' },
                count: { type: 'integer', example: 320 },
              },
            },
          },
          dailyTrend: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', example: '2026-06-30' },
                count: { type: 'integer', example: 185 },
              },
            },
          },
        },
      },
      DashboardSummary: {
        type: 'object',
        properties: {
          userStats: { $ref: '#/components/schemas/UserStatsReport' },
          behaviorStats: { $ref: '#/components/schemas/BehaviorStatsReport' },
          adaptationStats: {
            type: 'object',
            properties: {
              totalAdaptations: { type: 'integer', example: 120 },
              adaptationsByCategory: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: { type: 'string', example: 'BEGINNER' },
                    count: { type: 'integer', example: 70 },
                  },
                },
              },
            },
          },
          productStats: {
            type: 'object',
            properties: {
              totalProducts: { type: 'integer', example: 45 },
              productsByCategory: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    category: { type: 'string', example: 'Artisanat' },
                    count: { type: 'integer', example: 12 },
                    avgPrice: { type: 'number', example: 18500 },
                  },
                },
              },
              priceRange: {
                type: 'object',
                properties: {
                  min: { type: 'number', example: 1500 },
                  max: { type: 'number', example: 450000 },
                  avg: { type: 'number', example: 28500 },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        description: 'Creates a new user account with USER role and returns a JWT token. The user is automatically classified as BEGINNER upon registration and receives the default accessibility-adapted interface (simplified layout, Kinyarwanda, audio prompts, large font, high contrast).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
              example: {
                name: 'Jean Baptiste Habimana',
                email: 'habimana@example.com',
                password: 'securepass123',
                phone: '+250788123456',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '409': {
            description: 'Email already registered',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Email already registered' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Internal server error' },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login',
        description: 'Authenticates a user with email and password, returns a JWT token and user profile including their role (USER/ADMIN) and AI-predicted skill category.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
              example: {
                email: 'habimana@example.com',
                password: 'securepass123',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Invalid email or password' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Internal server error' },
              },
            },
          },
        },
      },
    },
    '/auth/profile': {
      get: {
        tags: ['Authentication'],
        summary: 'Get user profile',
        description: 'Returns the authenticated user\'s profile including their role, AI-predicted skill category, and most recent adaptation settings.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserProfile' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'User not found' },
              },
            },
          },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        description: 'Retrieves paginated list of products with optional search, category, and price filters.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'search', in: 'query', schema: { type: 'string', example: 'agaseke' }, description: 'Search in name and description' },
          { name: 'category', in: 'query', schema: { type: 'string', example: 'Artisanat' }, description: 'Filter by category' },
          { name: 'minPrice', in: 'query', schema: { type: 'number', example: 1000 }, description: 'Minimum price in RWF' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number', example: 100000 }, description: 'Maximum price in RWF' },
        ],
        responses: {
          '200': {
            description: 'List of products',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductListResponse' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Internal server error' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a product (Admin only)',
        description: 'Creates a new product listing. Requires admin authentication.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
              example: {
                name: 'Agaseke - Panier Traditionnel',
                nameRw: 'Agaseke',
                description: 'Panier traditionnel rwandais tissé à la main par des artisans locaux de Nyabugogo',
                descriptionRw: 'Agaseke gakozwe n\'intoki n\'abanyarwanda bo muri Nyabugogo',
                price: 25000,
                category: 'Artisanat',
                imageUrl: '/images/agaseke.jpg',
                stock: 50,
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Product created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Internal server error' },
              },
            },
          },
        },
      },
    },
    '/products/categories': {
      get: {
        tags: ['Products'],
        summary: 'Get product categories',
        description: 'Returns a list of all distinct product categories.',
        responses: {
          '200': {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { type: 'string' },
                },
                example: ['Artisanat', 'Electronique', 'Alimentation', 'Vêtements', 'Maison'],
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Internal server error' },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID',
        description: 'Retrieves detailed information about a specific product.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
        ],
        responses: {
          '200': {
            description: 'Product details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Product not found' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update product (Admin only)',
        description: 'Updates an existing product. Requires admin authentication. Send only the fields you want to update.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductInput' },
              example: { price: 22000, stock: 45 },
            },
          },
        },
        responses: {
          '200': {
            description: 'Product updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Product' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Product not found' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete product (Admin only)',
        description: 'Deletes a product from the catalog. Requires admin authentication.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
        ],
        responses: {
          '200': {
            description: 'Product deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Product deleted successfully' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Product not found' },
              },
            },
          },
        },
      },
    },
    '/behavior/track': {
      post: {
        tags: ['Behavior'],
        summary: 'Track user behavior',
        description: 'Records a user interaction event (click latency, wrong clicks, navigation patterns, etc.) for AI analysis.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TrackBehaviorInput' },
              example: {
                clickLatency: 3200,
                wrongClicks: 3,
                timeSpent: 45000,
                repeatedActions: 5,
                navigationPattern: 'home > products > search > product_detail',
                page: '/products/artisanat',
                deviceInfo: 'Mozilla/5.0 (Linux; Android 12; Samsung Galaxy A13)',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Behavior recorded',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserBehavior' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/behavior': {
      get: {
        tags: ['Behavior'],
        summary: 'Get user behavior history',
        description: 'Returns the authenticated user\'s past behavior records with pagination and date filtering.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date', example: '2026-06-01' }, description: 'Start date filter (ISO 8601 date)' },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date', example: '2026-07-06' }, description: 'End date filter (ISO 8601 date)' },
        ],
        responses: {
          '200': {
            description: 'Behavior records',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    behaviors: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/UserBehavior' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/behavior/summary': {
      get: {
        tags: ['Behavior'],
        summary: 'Get behavior summary',
        description: 'Returns aggregated behavior metrics for the authenticated user based on the last 50 records (averages and totals).',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Behavior summary',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BehaviorSummary' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/adaptation': {
      get: {
        tags: ['Adaptation'],
        summary: 'Get current interface adaptation',
        description: 'Returns the current UI/UX adaptation configuration for the authenticated user. If no adaptation exists, creates a default BEGINNER profile with full accessibility settings: simplified layout, Kinyarwanda language, audio prompts, large font, and high contrast.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Current adaptation settings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Adaptation' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/adaptation/analyze': {
      post: {
        tags: ['Adaptation'],
        summary: 'Analyze and adapt interface',
        description: 'Triggers AI analysis of the user\'s recent behavior (last 50 records) to classify their skill level and dynamically adapt the interface. The classification determines the adaptation profile: BEGINNER gets full accessibility (simplified layout, Kinyarwanda, audio, large font, high contrast), INTERMEDIATE gets partial (simplified layout, Kinyarwanda, medium font), ADVANCED gets minimal (standard layout, English, medium font). Also creates an AI prediction record and updates the user\'s category.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Interface adapted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Adaptation' },
                example: {
                  id: 'clv1c2d3e4f5g6h7i8j9k0l1m',
                  userId: 'clv1a2b3c4d5e6f7g8h9i0jkl',
                  userCategory: 'BEGINNER',
                  simplifiedLayout: true,
                  kinyarwandaEnabled: true,
                  audioPromptsEnabled: true,
                  fontSize: 'large',
                  highContrast: true,
                  createdAt: '2026-07-06T10:30:00Z',
                  updatedAt: '2026-07-06T10:30:00Z',
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/adaptation/override': {
      put: {
        tags: ['Adaptation'],
        summary: 'Manually override adaptation settings',
        description: 'Allows the user to manually adjust their interface adaptation settings. If no adaptation exists, creates one with BEGINNER defaults and applies the overrides.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AdaptationOverride' },
              example: {
                simplifiedLayout: false,
                kinyarwandaEnabled: true,
                audioPromptsEnabled: false,
                fontSize: 'medium',
                highContrast: false,
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Adaptation updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Adaptation' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/translations/translate': {
      post: {
        tags: ['Translations'],
        summary: 'Translate text to Kinyarwanda',
        description: 'Translates English text to Kinyarwanda using the built-in dictionary. Returns cached translations when available, otherwise generates a new translation and stores it.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TranslationInput' },
              examples: {
                'Welcome message': {
                  value: { text: 'Welcome to Kiramart Rwanda', context: 'homepage_header' },
                  summary: 'Translate a welcome message',
                },
                'Search prompt': {
                  value: { text: 'Search products here', context: 'search_bar' },
                  summary: 'Translate a search prompt',
                },
                'Product action': {
                  value: { text: 'Add to cart', context: 'product_button' },
                  summary: 'Translate a button label',
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Translation result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TranslationResponse' },
                examples: {
                  'cached': {
                    value: { sourceText: 'Welcome to Kiramart Rwanda', kinyarwandaText: 'Murakaza neza kuri Kiramart Rwanda', fromCache: true },
                    summary: 'Translation found in dictionary',
                  },
                  'new': {
                    value: { sourceText: 'Checkout now', kinyarwandaText: 'Checkout now', fromCache: false },
                    summary: 'No dictionary match, text returned as-is',
                  },
                },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/translations': {
      get: {
        tags: ['Translations'],
        summary: 'List all translations (Admin)',
        description: 'Returns paginated list of all stored English-Kinyarwanda translation pairs with optional search.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'search', in: 'query', schema: { type: 'string', example: 'welcome' }, description: 'Search in source or translated text' },
        ],
        responses: {
          '200': {
            description: 'List of translations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    translations: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Translation' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
      post: {
        tags: ['Translations'],
        summary: 'Add a translation (Admin)',
        description: 'Adds a new English-Kinyarwanda translation pair to the dictionary. Both sourceText and kinyarwandaText are required.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TranslationCreateInput' },
              example: {
                sourceText: 'Thank you',
                kinyarwandaText: 'Murakoze',
                context: 'general',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Translation created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Translation' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/translations/{id}': {
      put: {
        tags: ['Translations'],
        summary: 'Update a translation (Admin)',
        description: 'Updates an existing English-Kinyarwanda translation pair. Send only the fields you want to update.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Translation ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TranslationUpdateInput' },
              example: {
                kinyarwandaText: 'Murakoze cyane',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Translation updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Translation' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'Translation not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Translation not found' },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Translations'],
        summary: 'Delete a translation (Admin)',
        description: 'Deletes a translation pair from the dictionary.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Translation ID' },
        ],
        responses: {
          '200': {
            description: 'Translation deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Translation deleted' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'Translation not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Translation not found' },
              },
            },
          },
        },
      },
    },
    '/audio/generate': {
      post: {
        tags: ['Audio'],
        summary: 'Generate audio prompt (Admin)',
        description: 'Creates an audio prompt record for accessibility. If a prompt with the same text already exists, returns the existing one (deduplication).',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AudioPromptInput' },
              example: { text: 'Kanda hano urebe ibicuruzwa byacu', language: 'rw' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Audio prompt ready',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AudioPrompt' },
              },
            },
          },
          '400': {
            description: 'Validation failed',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ValidationError' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/audio': {
      get: {
        tags: ['Audio'],
        summary: 'List audio prompts',
        description: 'Returns all audio prompts, optionally filtered by language.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'language', in: 'query', schema: { type: 'string', enum: ['rw', 'en', 'fr'], example: 'rw' }, description: 'Filter by language' },
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 50 }, description: 'Max records to return' },
        ],
        responses: {
          '200': {
            description: 'List of audio prompts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AudioPrompt' },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/audio/{id}': {
      delete: {
        tags: ['Audio'],
        summary: 'Delete audio prompt (Admin)',
        description: 'Deletes an audio prompt record.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Audio prompt ID' },
        ],
        responses: {
          '200': {
            description: 'Audio prompt deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { message: { type: 'string', example: 'Audio prompt deleted' } },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'Audio prompt not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Audio prompt not found' },
              },
            },
          },
        },
      },
    },
    '/ai/predict': {
      post: {
        tags: ['AI Engine'],
        summary: 'Predict user category',
        description: 'Analyzes the user\'s last 50 behavior records, extracts features (avg click latency, total wrong clicks, etc.), and predicts their expertise category with a confidence score. BEGINNER = high friction (slow, many errors), INTERMEDIATE = moderate friction, ADVANCED = smooth navigation. Creates an AI prediction record for historical tracking.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'AI prediction result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AiPredictionResponse' },
                example: {
                  prediction: {
                    id: 'clv1d2e3f4g5h6i7j8k9l0m1n',
                    userId: 'clv1a2b3c4d5e6f7g8h9i0jkl',
                    clickLatency: 3200,
                    wrongClicks: 3,
                    timeSpent: 45000,
                    repeatedActions: 5,
                    predictedCategory: 'BEGINNER',
                    confidence: 0.85,
                    createdAt: '2026-07-06T10:30:00Z',
                  },
                  features: {
                    avgClickLatency: 3200,
                    totalWrongClicks: 3,
                    avgTimeSpent: 45000,
                    totalRepeatedActions: 5,
                  },
                  category: 'BEGINNER',
                  confidence: 0.85,
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/ai/history': {
      get: {
        tags: ['AI Engine'],
        summary: 'Get prediction history',
        description: 'Returns the user\'s recent AI prediction history.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, example: 10 }, description: 'Number of records to return' },
        ],
        responses: {
          '200': {
            description: 'Prediction history',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/AiPrediction' },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
        },
      },
    },
    '/reports/users': {
      get: {
        tags: ['Reports'],
        summary: 'User statistics report (Admin)',
        description: 'Returns aggregated user statistics including total users, distribution by category and role, and recent registrations (last 7 days).',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'User statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UserStatsReport' },
                example: {
                  totalUsers: 150,
                  usersByCategory: [
                    { category: 'BEGINNER', count: 85 },
                    { category: 'INTERMEDIATE', count: 45 },
                    { category: 'ADVANCED', count: 20 },
                  ],
                  usersByRole: [
                    { role: 'USER', count: 145 },
                    { role: 'ADMIN', count: 5 },
                  ],
                  recentRegistrations: 23,
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/reports/behavior': {
      get: {
        tags: ['Reports'],
        summary: 'Behavior statistics report (Admin)',
        description: 'Returns aggregated behavior metrics over a configurable time period, including top pages and daily trends.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'days', in: 'query', schema: { type: 'integer', default: 7, example: 7 }, description: 'Lookback period in days' },
        ],
        responses: {
          '200': {
            description: 'Behavior statistics',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/BehaviorStatsReport' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/reports/adaptations': {
      get: {
        tags: ['Reports'],
        summary: 'Adaptation statistics report (Admin)',
        description: 'Returns distribution of users across adaptation categories.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Adaptation statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalAdaptations: { type: 'integer', example: 120 },
                    adaptationsByCategory: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          category: { type: 'string', example: 'BEGINNER' },
                          count: { type: 'integer', example: 70 },
                        },
                      },
                    },
                  },
                },
                example: {
                  totalAdaptations: 120,
                  adaptationsByCategory: [
                    { category: 'BEGINNER', count: 70 },
                    { category: 'INTERMEDIATE', count: 35 },
                    { category: 'ADVANCED', count: 15 },
                  ],
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/reports/products': {
      get: {
        tags: ['Reports'],
        summary: 'Product statistics report (Admin)',
        description: 'Returns product catalog statistics including category distribution and price ranges.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Product statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalProducts: { type: 'integer', example: 45 },
                    productsByCategory: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          category: { type: 'string', example: 'Artisanat' },
                          count: { type: 'integer', example: 12 },
                          avgPrice: { type: 'number', example: 18500 },
                        },
                      },
                    },
                    priceRange: {
                      type: 'object',
                      properties: {
                        min: { type: 'number', example: 1500 },
                        max: { type: 'number', example: 450000 },
                        avg: { type: 'number', example: 28500 },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/reports/dashboard': {
      get: {
        tags: ['Reports'],
        summary: 'Dashboard summary (Admin)',
        description: 'Returns a complete dashboard summary combining user, behavior, adaptation, and product statistics in a single response. Behavior stats use a 7-day lookback period.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dashboard summary',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardSummary' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users (Admin)',
        description: 'Returns paginated list of all users with search and filter capabilities. Each user includes a behavior count.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'search', in: 'query', schema: { type: 'string', example: 'habimana' }, description: 'Search by name or email (case-insensitive)' },
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] }, description: 'Filter by user category' },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['USER', 'ADMIN'] }, description: 'Filter by user role' },
        ],
        responses: {
          '200': {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    users: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AdminUserListItem' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user details (Admin)',
        description: 'Returns detailed information about a specific user including their recent behaviors (last 20), full adaptation history, and AI predictions (last 10).',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' },
        ],
        responses: {
          '200': {
            description: 'User details',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AdminUserDetail' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'User not found' },
              },
            },
          },
        },
      },
    },
    '/admin/users/{id}/role': {
      put: {
        tags: ['Admin'],
        summary: 'Update user role (Admin)',
        description: 'Changes a user\'s role (USER/ADMIN). An admin action log is automatically created.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['role'],
                properties: {
                  role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'New role: USER (standard customer permissions) or ADMIN (full platform access)', example: 'ADMIN' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Role updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
                    name: { type: 'string', example: 'Jean Baptiste Habimana' },
                    email: { type: 'string', example: 'habimana@example.com' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'], description: 'Updated role: USER or ADMIN', example: 'ADMIN' },
                    category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], description: 'AI-predicted skill level', example: 'BEGINNER' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
          '404': {
            description: 'User not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'User not found' },
              },
            },
          },
        },
      },
    },
    '/admin/logs': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin action logs (Admin)',
        description: 'Returns paginated history of admin actions across the platform (role changes, etc.).',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 }, description: 'Items per page' },
          { name: 'adminId', in: 'query', schema: { type: 'string' }, description: 'Filter by admin ID' },
          { name: 'action', in: 'query', schema: { type: 'string', example: 'UPDATE_ROLE' }, description: 'Filter by action type' },
        ],
        responses: {
          '200': {
            description: 'Admin logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    logs: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/AdminAction' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/admin/settings': {
      get: {
        tags: ['Admin'],
        summary: 'Get system settings (Admin)',
        description: 'Returns platform overview statistics including total counts across all entities.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'System settings',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AdminSettings' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/upload/image': {
      post: {
        tags: ['Upload'],
        summary: 'Upload product image (Admin)',
        description: 'Uploads an image file to local storage and returns the URL. Requires multipart/form-data with a field named "image". Accepted formats: JPEG, PNG, GIF, WebP.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image file to upload (JPEG, PNG, GIF, WebP)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Image uploaded successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UploadResponse' },
                example: {
                  url: '/uploads/1737200000000-a1b2c3d4e5f6g7h8.jpg',
                },
              },
            },
          },
          '400': {
            description: 'No file provided',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'No file provided' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/upload/audio': {
      post: {
        tags: ['Upload'],
        summary: 'Upload audio file (Admin)',
        description: 'Uploads an audio file to local storage and returns the URL. Requires multipart/form-data with a field named "audio". Accepted formats: MP3, WAV, OGG, M4A.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['audio'],
                properties: {
                  audio: {
                    type: 'string',
                    format: 'binary',
                    description: 'Audio file to upload (MP3, WAV, OGG, M4A)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Audio uploaded successfully',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UploadResponse' },
                example: {
                  url: '/uploads/1737200000000-b2c3d4e5f6g7h8i9.mp3',
                },
              },
            },
          },
          '400': {
            description: 'No file provided',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'No file provided' },
              },
            },
          },
          '401': {
            description: 'Authentication required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Authentication required' },
              },
            },
          },
          '403': {
            description: 'Admin access required',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Admin access required' },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns the current health status, timestamp, and uptime of the API server.',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'number', example: 86400 },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
