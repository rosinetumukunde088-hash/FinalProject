const { Router } = require('express');
const reportingController = require('./reporting.controller');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

const router = Router();

router.get('/users', authenticate, authorizeAdmin, reportingController.getUserStats);
router.get('/behavior', authenticate, authorizeAdmin, reportingController.getBehaviorStats);
router.get('/adaptations', authenticate, authorizeAdmin, reportingController.getAdaptationStats);
router.get('/products', authenticate, authorizeAdmin, reportingController.getProductStats);
router.get('/dashboard', authenticate, authorizeAdmin, reportingController.getDashboardSummary);

module.exports = router;
