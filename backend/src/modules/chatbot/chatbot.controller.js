const chatbotService = require('./chatbot.service');

class ChatbotController {
  async sendMessage(req, res, next) {
    try {
      const { message } = req.body;

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ error: 'Message is required' });
      }

      if (message.length > 500) {
        return res.status(400).json({ error: 'Message too long (max 500 characters)' });
      }

      const response = await chatbotService.getResponse(message.trim());

      res.json({
        reply: response.text,
        link: response.link,
        suggestions: response.suggestions || []
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ChatbotController();
