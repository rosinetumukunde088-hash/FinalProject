const adminService = require('./admin.service');
const { validationResult } = require('express-validator');

class AdminController {
  async createUser(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }
      const user = await adminService.createUser(req.body);
      await adminService.logAction(req.user.id, 'CREATE_USER', user.id, `Created user ${user.email}`);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req, res, next) {
    try {
      // A Manager can only browse trader accounts, never the full user list.
      const query = req.user.role === 'MANAGER' ? { ...req.query, role: 'TRADER' } : req.query;
      const result = await adminService.getAllUsers(query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserDetail(req, res, next) {
    try {
      const user = await adminService.getUserDetail(req.params.id);
      if (req.user.role === 'MANAGER' && user.role !== 'TRADER') {
        return res.status(403).json({ message: 'Managers can only view trader accounts' });
      }
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

  async updateUserStatus(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }
      if (req.params.id === req.user.id && !req.body.isActive) {
        return res.status(400).json({ message: 'You cannot deactivate your own account' });
      }
      if (req.user.role === 'MANAGER') {
        const target = await adminService.getUserDetail(req.params.id);
        if (target.role !== 'TRADER') {
          return res.status(403).json({ message: 'Managers can only activate or deactivate trader accounts' });
        }
      }
      const user = await adminService.updateUserStatus(req.params.id, req.body.isActive);
      await adminService.logAction(
        req.user.id,
        req.body.isActive ? 'ACTIVATE_USER' : 'DEACTIVATE_USER',
        req.params.id,
        `Account ${req.body.isActive ? 'activated' : 'deactivated'}`
      );
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
