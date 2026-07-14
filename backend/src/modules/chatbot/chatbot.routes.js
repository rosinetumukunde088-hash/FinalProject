const { Router } = require('express');
const chatbotController = require('./chatbot.controller');

const router = Router();

router.post('/send', (req, res, next) => chatbotController.sendMessage(req, res, next));

module.exports = router;
