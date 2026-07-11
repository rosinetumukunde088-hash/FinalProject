const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

function uploadFromBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder || 'kiramart_uploads' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

function deleteByPublicId(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadFromBuffer, deleteByPublicId };
