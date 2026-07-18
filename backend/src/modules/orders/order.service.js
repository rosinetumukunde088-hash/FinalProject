const { prisma } = require('../../config/db');
const { paginate } = require('../../utils/helpers');

class OrderService {
  async createOrder(userId, { items, paymentMethod, total }) {
    const order = await prisma.order.create({
      data: {
        userId,
        paymentMethod,
        total,
        items: {
          create: items.map((item) => ({
            productId: item.productId || item.id || null,
            name: item.name,
            imageUrl: item.imageUrl || null,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true },
    });
    return order;
  }

  async getUserOrders(userId, query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // Orders placed by real customers, for Admin/Manager/Trader to review. Always
  // restricted to buyers with the plain USER role, so staff test orders
  // (placed by an Admin, Manager, or Trader account) never show up here. A
  // Trader additionally only sees orders that include at least one of their
  // own products; Admin and Manager see every customer order.
  async getStoreOrders(user, query) {
    const { skip, take, page, limit } = paginate(query.page, query.limit);
    const where = { user: { role: 'USER' } };

    if (user.role === 'TRADER') {
      const products = await prisma.product.findMany({
        where: { createdById: user.id },
        select: { id: true },
      });
      where.items = { some: { productId: { in: products.map((p) => p.id) } } };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}

module.exports = new OrderService();
