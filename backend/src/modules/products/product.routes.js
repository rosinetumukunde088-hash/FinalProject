const { Router } = require('express');
const { body } = require('express-validator');
const productController = require('./product.controller');
const { authenticate, authorizeAdminOrTrader } = require('../../middleware/auth');

const router = Router();

router.get('/', productController.findAll);
router.get('/categories', productController.getCategories);
router.get('/mine', authenticate, authorizeAdminOrTrader, productController.findMine);
router.get('/:id', productController.findById);

router.post(
  '/',
  authenticate,
  authorizeAdminOrTrader,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  productController.create
);

router.put('/:id', authenticate, authorizeAdminOrTrader, productController.update);
router.delete('/:id', authenticate, authorizeAdminOrTrader, productController.delete);

module.exports = router;
