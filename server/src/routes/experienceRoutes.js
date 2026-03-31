const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getExperiences, createExperience, updateExperience, deleteExperience } = require('../controllers/experienceController')

const router = express.Router()

router.get('/', getExperiences)
router.post('/', protect, createExperience)
router.put('/:id', protect, updateExperience)
router.delete('/:id', protect, deleteExperience)

module.exports = router
