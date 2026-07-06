const aiService = require('./ai.service');

class AIController {
  async predict(req, res, next) {
    try {
      const result = await aiService.predictCategory(req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const history = await aiService.getPredictionHistory(req.user.id, req.query.limit);
      res.json(history);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AIController();
