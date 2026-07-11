const { Router } = require('express');
const multer = require('multer');
const { authenticate, authorizeAdmin } = require('../middleware/auth');
const { uploadImage, uploadAudio } = require('./upload.controller');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'audio') {
      cb(null, /^audio\//.test(file.mimetype));
    } else {
      cb(null, /^image\//.test(file.mimetype));
    }
  },
});

const router = Router();

router.post('/image', authenticate, authorizeAdmin, upload.single('image'), uploadImage);
router.post('/audio', authenticate, authorizeAdmin, upload.single('audio'), uploadAudio);

module.exports = router;
