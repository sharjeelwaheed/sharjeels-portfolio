const express = require('express')
const rateLimit = require('express-rate-limit')
const { login, verify } = require('../controllers/authController')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { message: 'Too many login attempts — try again in 15 minutes' },
})

router.post('/login', loginLimiter, login)
router.get('/verify', protect, verify)

module.exports = router
