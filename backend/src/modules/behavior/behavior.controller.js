const behaviorService = require('./behavior.service');

class BehaviorController {
  async track(req, res, next) {
    try {
      const behavior = await behaviorService.track(req.user.id, req.body);
      res.status(201).json(behavior);
    } catch (error) {
      next(error);
    }
  }

  async getUserBehaviors(req, res, next) {
    try {
      const result = await behaviorService.getUserBehaviors(req.user.id, req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req, res, next) {
    try {
      const summary = await behaviorService.getSummary(req.user.id);
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BehaviorController();
