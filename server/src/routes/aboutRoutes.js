const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getAbout, updateAbout } = require('../controllers/aboutController')

const router = express.Router()

router.get('/', getAbout)
router.put('/', protect, updateAbout)

module.exports = router
