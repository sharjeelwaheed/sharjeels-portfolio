const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController')

const router = express.Router()

router.get('/', getSkills)
router.post('/', protect, createSkill)
router.put('/:id', protect, updateSkill)
router.delete('/:id', protect, deleteSkill)

module.exports = router
