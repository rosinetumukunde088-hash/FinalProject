const { uploadFromBuffer } = require('./upload.service');

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const result = await uploadFromBuffer(req.file.buffer, 'kiramart_products');
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
};

const uploadAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }
    const result = await uploadFromBuffer(req.file.buffer, 'kiramart_audio');
    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImage, uploadAudio };
