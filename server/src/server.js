require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const connectDB = require('./config/db')
const { errorHandler } = require('./middleware/errorMiddleware')

const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectRoutes')
const skillRoutes = require('./routes/skillRoutes')
const aboutRoutes = require('./routes/aboutRoutes')
const experienceRoutes = require('./routes/experienceRoutes')
const uploadRoutes = require('./routes/uploadRoutes')

connectDB()

const app = express()

app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/experience', experienceRoutes)
app.use('/api/upload', uploadRoutes)

app.use(errorHandler)

// Local dev: listen on port. Vercel: export app as serverless function.
if (require.main === module) {
  const PORT = process.env.PORT || 5001
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}

module.exports = app
