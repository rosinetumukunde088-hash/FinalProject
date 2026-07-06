const audioService = require('./audio.service');

class AudioController {
  async generatePrompt(req, res, next) {
    try {
      const result = await audioService.generatePrompt(req.body.text, req.body.language);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req, res, next) {
    try {
      const prompts = await audioService.findAll(req.query);
      res.json(prompts);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await audioService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AudioController();
