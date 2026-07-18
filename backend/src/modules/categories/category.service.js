const { prisma } = require('../../config/db');

class CategoryService {
  async findAll() {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id) {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw Object.assign(new Error('Category not found'), { statusCode: 404 });
    }
    return category;
  }

  async create(data) {
    return prisma.category.create({ data });
  }

  async update(id, data) {
    await this.findById(id);
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id) {
    await this.findById(id);
    await prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}

module.exports = new CategoryService();
