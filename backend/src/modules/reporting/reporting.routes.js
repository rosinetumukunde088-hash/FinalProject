const { Router } = require('express');
const reportingController = require('./reporting.controller');
const { authenticate, authorizeAdminOrManager } = require('../../middleware/auth');

const router = Router();

router.get('/users', authenticate, authorizeAdminOrManager, reportingController.getUserStats);
router.get('/behavior', authenticate, authorizeAdminOrManager, reportingController.getBehaviorStats);
router.get('/adaptations', authenticate, authorizeAdminOrManager, reportingController.getAdaptationStats);
router.get('/products', authenticate, authorizeAdminOrManager, reportingController.getProductStats);
router.get('/sales', authenticate, authorizeAdminOrManager, reportingController.getSalesStats);
router.get('/dashboard', authenticate, authorizeAdminOrManager, reportingController.getDashboardSummary);

module.exports = router;
