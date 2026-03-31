const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true },
  longDesc: { type: String },
  imageUrl: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  techStack: [{ type: String }],
  category: {
    type: String,
    enum: ['web', 'mobile', 'fullstack', 'ai', 'backend', 'other'],
    default: 'web',
  },
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  visible: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Project', projectSchema)
