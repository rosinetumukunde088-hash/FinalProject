const { Router } = require('express');
const adaptationController = require('./adaptation.controller');
const { authenticate } = require('../../middleware/auth');

const router = Router();

router.get('/', authenticate, adaptationController.getCurrent);
router.post('/analyze', authenticate, adaptationController.analyzeAndAdapt);
router.put('/override', authenticate, adaptationController.manualOverride);

module.exports = router;
