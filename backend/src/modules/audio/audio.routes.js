const { Router } = require('express');
const { body } = require('express-validator');
const audioController = require('./audio.controller');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

const router = Router();

router.post(
  '/generate',
  authenticate,
  authorizeAdmin,
  [body('text').trim().notEmpty().withMessage('Text is required')],
  audioController.generatePrompt
);

router.get('/', authenticate, audioController.findAll);
router.delete('/:id', authenticate, authorizeAdmin, audioController.delete);

module.exports = router;
