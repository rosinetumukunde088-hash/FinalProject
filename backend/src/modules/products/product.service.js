const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class ProductService {
  async create(data) {
    return prisma.product.create({ data });
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

  async update(id, data) {
    await this.findById(id);
    return prisma.product.update({ where: { id }, data });
  }

  async delete(id) {
    await this.findById(id);
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
