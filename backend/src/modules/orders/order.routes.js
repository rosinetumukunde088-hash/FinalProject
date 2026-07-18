const { Router } = require('express');
const { body } = require('express-validator');
const orderController = require('./order.controller');
const { authenticate, authorizeStoreStaff } = require('../../middleware/auth');

const router = Router();

router.post(
  '/',
  authenticate,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.name').trim().notEmpty().withMessage('Item name is required'),
    body('items.*.price').isFloat({ min: 0 }).withMessage('Item price must be a positive number'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Item quantity must be at least 1'),
    body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
    body('total').isFloat({ min: 0 }).withMessage('Total must be a positive number'),
  ],
  orderController.createOrder
);

router.get('/', authenticate, orderController.getMyOrders);
router.get('/store', authenticate, authorizeStoreStaff, orderController.getStoreOrders);

module.exports = router;
