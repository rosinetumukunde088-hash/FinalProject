const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class ProductService {
  async create(data, userId) {
    return prisma.product.create({ data: { ...data, createdById: userId || null } });
  }

  async findAll(query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = query.category;
    }

    if (query.minPrice) {
      where.price = { ...where.price, gte: parseFloat(query.minPrice) };
    }

    if (query.maxPrice) {
      where.price = { ...where.price, lte: parseFloat(query.maxPrice) };
    }

    if (query.ownerId) {
      where.createdById = query.ownerId;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw Object.assign(new Error('Product not found'), { statusCode: 404 });
    }
    return product;
  }

  async update(id, data, user) {
    const product = await this.findById(id);
    if (user.role === 'TRADER' && product.createdById !== user.id) {
      throw Object.assign(new Error('You can only edit your own products'), { statusCode: 403 });
    }
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id, user) {
    const product = await this.findById(id);
    if (user.role === 'TRADER' && product.createdById !== user.id) {
      throw Object.assign(new Error('You can only delete your own products'), { statusCode: 403 });
    }
    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  async getCategories() {
    const result = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return result.map((r) => r.category);
  }
}

module.exports = new ProductService();
