const { Router } = require('express');
const { body } = require('express-validator');
const translationController = require('./translation.controller');
const { authenticate, authorizeAdmin } = require('../../middleware/auth');

const router = Router();

router.post(
  '/translate',
  authenticate,
  [body('text').trim().notEmpty().withMessage('Text to translate is required')],
  translationController.translate
);

router.get('/', authenticate, authorizeAdmin, translationController.findAll);
router.post('/', authenticate, authorizeAdmin, translationController.addTranslation);
router.put('/:id', authenticate, authorizeAdmin, translationController.updateTranslation);
router.delete('/:id', authenticate, authorizeAdmin, translationController.deleteTranslation);

module.exports = router;
