const express = require('express')
const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('../config/cloudinary')
const { protect } = require('../middleware/authMiddleware')
const { uploadImage, deleteImage } = require('../controllers/uploadController')

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

const router = express.Router()

router.post('/', protect, upload.single('image'), uploadImage)
router.delete('/', protect, deleteImage)

module.exports = router
