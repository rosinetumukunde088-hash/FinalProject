const swaggerJsdoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AI-Assisted UI/UX Generation Middleware - Kiramart Rwanda',
    version: '1.0.0',
    description: `API documentation for the AI-Assisted UI/UX Generation Middleware for Locally Tailored Kinyarwanda E-Commerce Platforms.

**Case Study:** Kiramart Rwanda

**Purpose:** This middleware monitors user interaction behaviors (click latency, navigation patterns), analyzes user difficulties using AI, and dynamically adapts the interface by generating simplified layouts, Kinyarwanda language support, and audio prompts.`,
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
    { name: 'Authentication', description: 'User registration, login, and profile management' },
    { name: 'Products', description: 'Product catalog browsing, searching, and management' },
    { name: 'Behavior', description: 'User interaction behavior tracking and analysis' },
    { name: 'Adaptation', description: 'AI-driven interface adaptation engine' },
    { name: 'Translations', description: 'English to Kinyarwanda translation services' },
    { name: 'Audio', description: 'Audio prompt generation for accessibility' },
    { name: 'AI Engine', description: 'AI prediction and user classification endpoints' },
    { name: 'Reports', description: 'Administrative analytics and reporting' },
    { name: 'Admin', description: 'User management and system administration' },
    { name: 'System', description: 'Health check and system endpoints' },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token from the login/register response',
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
              role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
              category: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], example: 'BEGINNER' },
              phone: { type: 'string', example: '+250788123456' },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
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
      TrackBehaviorInput: {
        type: 'object',
        properties: {
          clickLatency: { type: 'integer', description: 'Time between click and response in ms', example: 3200 },
          wrongClicks: { type: 'integer', description: 'Number of incorrect clicks', example: 3 },
          timeSpent: { type: 'integer', description: 'Time spent on page in ms', example: 45000 },
          repeatedActions: { type: 'integer', description: 'Count of repeated actions', example: 5 },
          navigationPattern: { type: 'string', description: 'Navigation flow pattern', example: 'home > products > search > product_detail' },
          page: { type: 'string', description: 'Current page', example: '/products/electronics' },
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
        properties: {
          id: { type: 'string', example: 'clv1c2d3e4f5g6h7i8j9k0l1m' },
          userId: { type: 'string', example: 'clv1a2b3c4d5e6f7g8h9i0jkl' },
          userCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], example: 'BEGINNER' },
          simplifiedLayout: { type: 'boolean', example: true },
          kinyarwandaEnabled: { type: 'boolean', example: true },
          audioPromptsEnabled: { type: 'boolean', example: true },
          fontSize: { type: 'string', enum: ['large', 'medium'], example: 'large' },
          highContrast: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      AdaptationOverride: {
        type: 'object',
        properties: {
          userCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], example: 'INTERMEDIATE' },
          simplifiedLayout: { type: 'boolean', example: false },
          kinyarwandaEnabled: { type: 'boolean', example: true },
          audioPromptsEnabled: { type: 'boolean', example: false },
          fontSize: { type: 'string', enum: ['large', 'medium'], example: 'medium' },
          highContrast: { type: 'boolean', example: false },
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
          id: { type: 'string' },
          sourceText: { type: 'string', example: 'Welcome' },
          kinyarwandaText: { type: 'string', example: 'Murakaza neza' },
          context: { type: 'string', example: 'homepage' },
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
          id: { type: 'string' },
          text: { type: 'string', example: 'Kanda hano urebe ibicuruzwa' },
          audioUrl: { type: 'string', example: '/audio/prompt_1700000000_rw.mp3' },
          language: { type: 'string', example: 'rw' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      AiPredictionResponse: {
        type: 'object',
        properties: {
          prediction: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              userId: { type: 'string' },
              clickLatency: { type: 'integer', example: 3200 },
              wrongClicks: { type: 'integer', example: 3 },
              timeSpent: { type: 'integer', example: 45000 },
              repeatedActions: { type: 'integer', example: 5 },
              predictedCategory: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], example: 'BEGINNER' },
              confidence: { type: 'number', example: 0.85 },
              createdAt: { type: 'string', format: 'date-time' },
            },
          },
          features: {
            type: 'object',
            properties: {
              avgClickLatency: { type: 'integer', example: 3200 },
              totalWrongClicks: { type: 'integer', example: 3 },
              avgTimeSpent: { type: 'integer', example: 45000 },
              totalRepeatedActions: { type: 'integer', example: 5 },
            },
          },
          category: { type: 'string', example: 'BEGINNER' },
          confidence: { type: 'number', example: 0.85 },
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
      AdminUserDetail: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string', example: 'Jean Baptiste Habimana' },
          email: { type: 'string', example: 'habimana@example.com' },
          role: { type: 'string', example: 'USER' },
          category: { type: 'string', example: 'BEGINNER' },
          phone: { type: 'string', example: '+250788123456' },
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
            items: { type: 'object' },
          },
          adaptations: {
            type: 'array',
            items: { $ref: '#/components/schemas/Adaptation' },
          },
          predictions: {
            type: 'array',
            items: { type: 'object' },
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
        description: 'Creates a new user account and returns a JWT token. The user is automatically classified as BEGINNER upon registration.',
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
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login',
        description: 'Authenticates a user with email and password, returns a JWT token.',
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
          '401': {
            description: 'Invalid credentials',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
                example: { message: 'Invalid email or password' },
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
        description: 'Returns the authenticated user\'s profile including their current adaptation settings.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profile retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/AuthResponse' },
                    {
                      type: 'object',
                      properties: {
                        adaptations: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Adaptation' },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List all products',
        description: 'Retrieves paginated list of products with optional search, category, and price filters.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', example: 1 }, description: 'Page number' },
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 }, description: 'Items per page' },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
                  example: ['Artisanat', 'Electronique', 'Alimentation', 'Vêtements', 'Maison'],
                },
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
          '404': { description: 'Product not found' },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update product (Admin only)',
        description: 'Updates an existing product. Requires admin authentication.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Product ID' },
        ],
        requestBody: {
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Product not found' },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Product not found' },
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
                schema: { type: 'object' },
              },
            },
          },
          '401': { description: 'Authentication required' },
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
          { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 20 } },
          { name: 'from', in: 'query', schema: { type: 'string', format: 'date', example: '2026-06-01' }, description: 'Start date filter' },
          { name: 'to', in: 'query', schema: { type: 'string', format: 'date', example: '2026-07-06' }, description: 'End date filter' },
        ],
        responses: {
          '200': {
            description: 'Behavior records',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    behaviors: { type: 'array', items: { type: 'object' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/behavior/summary': {
      get: {
        tags: ['Behavior'],
        summary: 'Get behavior summary',
        description: 'Returns aggregated behavior metrics for the authenticated user (averages and totals).',
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
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/adaptation': {
      get: {
        tags: ['Adaptation'],
        summary: 'Get current interface adaptation',
        description: 'Returns the current UI/UX adaptation configuration for the authenticated user. Creates a default BEGINNER adaptation if none exists.',
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
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/adaptation/analyze': {
      post: {
        tags: ['Adaptation'],
        summary: 'Analyze and adapt interface',
        description: 'Triggers AI analysis of the user\'s recent behavior to classify their skill level (BEGINNER/INTERMEDIATE/ADVANCED) and dynamically adapt the interface. Stores an AI prediction record.',
        security: [{ BearerAuth: [] }],
        responses: {
          '200': {
            description: 'Interface adapted',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Adaptation' },
                example: {
                  userCategory: 'BEGINNER',
                  simplifiedLayout: true,
                  kinyarwandaEnabled: true,
                  audioPromptsEnabled: true,
                  fontSize: 'large',
                  highContrast: true,
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/adaptation/override': {
      put: {
        tags: ['Adaptation'],
        summary: 'Manually override adaptation settings',
        description: 'Allows the user to manually adjust their interface adaptation settings (e.g., disable simplified layout, toggle Kinyarwanda).',
        security: [{ BearerAuth: [] }],
        requestBody: {
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
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/translations/translate': {
      post: {
        tags: ['Translations'],
        summary: 'Translate text to Kinyarwanda',
        description: 'Translates English text to Kinyarwanda using the built-in dictionary. Returns cached translations when available, otherwise generates a new translation.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TranslationInput' },
              examples: {
                'Welcome message': {
                  value: { text: 'Welcome to Kiramart Rwanda', context: 'homepage_header' },
                },
                'Search prompt': {
                  value: { text: 'Search products here', context: 'search_bar' },
                },
                'Product action': {
                  value: { text: 'Add to cart', context: 'product_button' },
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
                  },
                  'new': {
                    value: { sourceText: 'Checkout now', kinyarwandaText: 'Checkout now', fromCache: false },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/translations': {
      get: {
        tags: ['Translations'],
        summary: 'List all translations (Admin)',
        description: 'Returns paginated list of all stored English-Kinyarwanda translation pairs.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
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
                    translations: { type: 'array', items: { $ref: '#/components/schemas/Translation' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
      post: {
        tags: ['Translations'],
        summary: 'Add a translation (Admin)',
        description: 'Adds a new English-Kinyarwanda translation pair to the dictionary.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TranslationInput' },
              example: { sourceText: 'Thank you', kinyarwandaText: 'Murakoze', context: 'general' },
            },
          },
        },
        responses: {
          '201': { description: 'Translation created' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/translations/{id}': {
      put: {
        tags: ['Translations'],
        summary: 'Update a translation (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Translation updated' },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Translation not found' },
        },
      },
      delete: {
        tags: ['Translations'],
        summary: 'Delete a translation (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Translation not found' },
        },
      },
    },
    '/audio/generate': {
      post: {
        tags: ['Audio'],
        summary: 'Generate audio prompt (Admin)',
        description: 'Creates an audio prompt record for accessibility. If a prompt with the same text and language exists, returns the existing one.',
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
          { name: 'language', in: 'query', schema: { type: 'string', enum: ['rw', 'en', 'fr'], example: 'rw' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 50 } },
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
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/audio/{id}': {
      delete: {
        tags: ['Audio'],
        summary: 'Delete audio prompt (Admin)',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'Audio prompt not found' },
        },
      },
    },
    '/ai/predict': {
      post: {
        tags: ['AI Engine'],
        summary: 'Predict user category',
        description: 'Analyzes the user\'s last 50 behavior records, extracts features (avg click latency, total wrong clicks, etc.), and predicts their expertise category (BEGINNER/INTERMEDIATE/ADVANCED) with a confidence score.',
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
          '401': { description: 'Authentication required' },
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
          { name: 'limit', in: 'query', schema: { type: 'integer', example: 10 }, description: 'Number of records to return' },
        ],
        responses: {
          '200': {
            description: 'Prediction history',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      userId: { type: 'string' },
                      predictedCategory: { type: 'string', example: 'BEGINNER' },
                      confidence: { type: 'number', example: 0.85 },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
        },
      },
    },
    '/reports/users': {
      get: {
        tags: ['Reports'],
        summary: 'User statistics report (Admin)',
        description: 'Returns aggregated user statistics including total users, distribution by category and role, and recent registrations.',
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
          { name: 'days', in: 'query', schema: { type: 'integer', example: 7 }, description: 'Lookback period in days' },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
              },
            },
          },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/reports/dashboard': {
      get: {
        tags: ['Reports'],
        summary: 'Dashboard summary (Admin)',
        description: 'Returns a complete dashboard summary combining user, behavior, adaptation, and product statistics in a single response.',
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/admin/users': {
      get: {
        tags: ['Admin'],
        summary: 'List all users (Admin)',
        description: 'Returns paginated list of all users with search and filter capabilities.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'search', in: 'query', schema: { type: 'string', example: 'habimana' }, description: 'Search by name or email' },
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] } },
          { name: 'role', in: 'query', schema: { type: 'string', enum: ['USER', 'ADMIN'] } },
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
                      items: { $ref: '#/components/schemas/AdminUserDetail' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/admin/users/{id}': {
      get: {
        tags: ['Admin'],
        summary: 'Get user details (Admin)',
        description: 'Returns detailed information about a specific user including their recent behaviors, adaptation history, and AI predictions.',
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'User not found' },
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
                properties: {
                  role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'ADMIN' },
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
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    role: { type: 'string', example: 'ADMIN' },
                    category: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
          '404': { description: 'User not found' },
        },
      },
    },
    '/admin/logs': {
      get: {
        tags: ['Admin'],
        summary: 'Get admin action logs (Admin)',
        description: 'Returns paginated history of admin actions across the platform.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
          { name: 'adminId', in: 'query', schema: { type: 'string' }, description: 'Filter by admin ID' },
          { name: 'action', in: 'query', schema: { type: 'string' }, description: 'Filter by action type' },
        ],
        responses: {
          '200': {
            description: 'Admin logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    logs: { type: 'array', items: { type: 'object' } },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
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
          '401': { description: 'Authentication required' },
          '403': { description: 'Admin access required' },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Returns the current health status of the API server.',
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
