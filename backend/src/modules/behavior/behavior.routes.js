const { Router } = require('express');
const behaviorController = require('./behavior.controller');
const { authenticate } = require('../../middleware/auth');

const router = Router();

router.post('/track', authenticate, behaviorController.track);
router.get('/', authenticate, behaviorController.getUserBehaviors);
router.get('/summary', authenticate, behaviorController.getSummary);

module.exports = router;
