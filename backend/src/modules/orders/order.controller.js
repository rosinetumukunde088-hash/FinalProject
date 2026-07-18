const orderService = require('./order.service');
const { validationResult } = require('express-validator');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }
      const order = await orderService.createOrder(req.user.id, req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req, res, next) {
    try {
      const result = await orderService.getUserOrders(req.user.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getStoreOrders(req, res, next) {
    try {
      const result = await orderService.getStoreOrders(req.user, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
