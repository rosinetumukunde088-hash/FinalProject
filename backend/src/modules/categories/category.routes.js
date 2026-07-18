const { Router } = require('express');
const { body } = require('express-validator');
const categoryController = require('./category.controller');
const { authenticate, authorizeAdminOrManager } = require('../../middleware/auth');

const router = Router();

router.get('/', categoryController.findAll);

router.post(
  '/',
  authenticate,
  authorizeAdminOrManager,
  [body('name').trim().notEmpty().withMessage('Category name is required')],
  categoryController.create
);

router.put('/:id', authenticate, authorizeAdminOrManager, categoryController.update);
router.delete('/:id', authenticate, authorizeAdminOrManager, categoryController.delete);

module.exports = router;
