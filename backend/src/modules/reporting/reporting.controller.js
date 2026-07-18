const reportingService = require('./reporting.service');

class ReportingController {
  async getUserStats(req, res, next) {
    try {
      const stats = await reportingService.getUserStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getBehaviorStats(req, res, next) {
    try {
      const stats = await reportingService.getBehaviorStats(req.query);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getAdaptationStats(req, res, next) {
    try {
      const stats = await reportingService.getAdaptationStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getProductStats(req, res, next) {
    try {
      const stats = await reportingService.getProductStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getSalesStats(req, res, next) {
    try {
      const stats = await reportingService.getSalesStats(req.query);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async getDashboardSummary(req, res, next) {
    try {
      const summary = await reportingService.getDashboardSummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportingController();
