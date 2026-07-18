const { Router } = require('express');
const { body } = require('express-validator');
const adminController = require('./admin.controller');
const { authenticate, authorizeAdmin, authorizeAdminOrManager } = require('../../middleware/auth');

const router = Router();

router.post(
  '/users',
  authenticate,
  authorizeAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['USER', 'ADMIN', 'TRADER', 'MANAGER']).withMessage('Role must be USER, ADMIN, TRADER, or MANAGER'),
  ],
  adminController.createUser
);

router.get('/users', authenticate, authorizeAdminOrManager, adminController.getAllUsers);
router.get('/users/:id', authenticate, authorizeAdminOrManager, adminController.getUserDetail);
router.put('/users/:id/role', authenticate, authorizeAdmin, adminController.updateUserRole);
router.put(
  '/users/:id/status',
  authenticate,
  authorizeAdminOrManager,
  [body('isActive').isBoolean().withMessage('isActive must be true or false')],
  adminController.updateUserStatus
);
router.get('/logs', authenticate, authorizeAdmin, adminController.getActionLogs);
router.get('/settings', authenticate, authorizeAdmin, adminController.getSettings);

module.exports = router;
