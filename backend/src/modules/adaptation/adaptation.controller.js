const adaptationService = require('./adaptation.service');

class AdaptationController {
  async getCurrent(req, res, next) {
    try {
      const adaptation = await adaptationService.getCurrentAdaptation(req.user.id);
      res.json(adaptation);
    } catch (error) {
      next(error);
    }
  }

  async analyzeAndAdapt(req, res, next) {
    try {
      const adaptation = await adaptationService.analyzeAndAdapt(req.user.id);
      res.json(adaptation);
    } catch (error) {
      next(error);
    }
  }

  async manualOverride(req, res, next) {
    try {
      const adaptation = await adaptationService.manualOverride(req.user.id, req.body);
      res.json(adaptation);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdaptationController();
