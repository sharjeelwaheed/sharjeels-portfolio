const cloudinary = require('../config/cloudinary')

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400)
      throw new Error('No file uploaded')
    }
    // multer-storage-cloudinary already uploaded the file; result is in req.file
    res.json({
      url: req.file.path,
      publicId: req.file.filename,
    })
  } catch (err) { next(err) }
}

const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body
    if (!publicId) { res.status(400); throw new Error('publicId required') }
    await cloudinary.uploader.destroy(publicId)
    res.json({ message: 'Image deleted' })
  } catch (err) { next(err) }
}

module.exports = { uploadImage, deleteImage }
