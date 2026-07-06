const { Router } = require('express');
const aiController = require('./ai.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.post('/predict', authenticate, aiController.predict);
router.get('/history', authenticate, aiController.getHistory);

module.exports = router;
