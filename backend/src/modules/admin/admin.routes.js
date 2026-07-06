const { Router } = require('express');
const adminController = require('./admin.controller');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

const router = Router();

router.get('/users', authenticate, authorizeAdmin, adminController.getAllUsers);
router.get('/users/:id', authenticate, authorizeAdmin, adminController.getUserDetail);
router.put('/users/:id/role', authenticate, authorizeAdmin, adminController.updateUserRole);
router.get('/logs', authenticate, authorizeAdmin, adminController.getActionLogs);
router.get('/settings', authenticate, authorizeAdmin, adminController.getSettings);

module.exports = router;
