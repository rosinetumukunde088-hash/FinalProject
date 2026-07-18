const { Router } = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const { authenticate, authorizeAdmin, authorizeAdminOrTrader } = require('../middleware/auth');
const { uploadImage, uploadAudio } = require('./upload.controller');

const UPLOAD_DIR = path.join(__dirname, '../../uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

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

router.post('/image', authenticate, authorizeAdminOrTrader, upload.single('image'), uploadImage);
router.post('/audio', authenticate, authorizeAdmin, upload.single('audio'), uploadAudio);

module.exports = router;
