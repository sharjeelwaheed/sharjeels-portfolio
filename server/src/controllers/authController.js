const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      res.status(400)
      throw new Error('Username and password are required')
    }
    const admin = await Admin.findOne({ username })
    if (!admin) {
      res.status(401)
      throw new Error('Invalid credentials')
    }
    const isMatch = await bcrypt.compare(password, admin.passwordHash)
    if (!isMatch) {
      res.status(401)
      throw new Error('Invalid credentials')
    }
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )
    res.json({ token, username: admin.username })
  } catch (err) {
    next(err)
  }
}

const verify = (req, res) => {
  res.json({ username: req.admin.username, id: req.admin.id })
}

module.exports = { login, verify }
