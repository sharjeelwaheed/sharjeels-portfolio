const express = require('express')
const { chat } = require('../controllers/chatController')
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: 'Too many messages, please slow down.' },
})

const router = express.Router()
router.post('/', limiter, chat)

module.exports = router
