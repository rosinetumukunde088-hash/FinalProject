const UPLOADS_BASE_URL = process.env.UPLOADS_BASE_URL || '/uploads';

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    res.json({ url: `${UPLOADS_BASE_URL}/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};

const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    res.json({ url: `${UPLOADS_BASE_URL}/${req.file.filename}` });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, uploadAudio };
