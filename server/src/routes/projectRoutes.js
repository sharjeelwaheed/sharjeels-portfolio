const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const {
  getProjects, getAllProjects, getProject,
  createProject, updateProject, toggleVisibility, deleteProject,
} = require('../controllers/projectController')

const router = express.Router()

router.get('/', getProjects)
router.get('/all', protect, getAllProjects)
router.get('/:id', getProject)
router.post('/', protect, createProject)
router.put('/:id', protect, updateProject)
router.patch('/:id/toggle', protect, toggleVisibility)
router.delete('/:id', protect, deleteProject)

module.exports = router
