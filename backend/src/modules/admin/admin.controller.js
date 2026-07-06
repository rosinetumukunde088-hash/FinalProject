const adminService = require('./admin.service');

class AdminController {
  async getAllUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetail(req, res, next) {
    try {
      const user = await adminService.getUserDetail(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUserRole(req, res, next) {
    try {
      const user = await adminService.updateUserRole(req.params.id, req.body.role);
      await adminService.logAction(req.user.id, 'UPDATE_ROLE', req.params.id, `Role changed to ${req.body.role}`);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async getActionLogs(req, res, next) {
    try {
      const result = await adminService.getActionLogs(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
