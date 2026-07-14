const translationService = require('./translation.service');
const { validationResult } = require('express-validator');

class TranslationController {
  async translate(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
      }
      const { text, context, sourceLang, targetLang } = req.body;
      const result = await translationService.translate(
        text,
        sourceLang || 'en',
        targetLang || 'rw',
        context
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const result = await translationService.findAll(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async addTranslation(req, res, next) {
    try {
      const result = await translationService.addTranslation(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateTranslation(req, res, next) {
    try {
      const result = await translationService.updateTranslation(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteTranslation(req, res, next) {
    try {
      const result = await translationService.deleteTranslation(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TranslationController();
