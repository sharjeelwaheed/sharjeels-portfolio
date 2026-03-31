const mongoose = require('mongoose')

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  iconUrl: { type: String, default: '' },
  category: {
    type: String,
    enum: ['frontend', 'backend', 'database', 'tools', 'mobile', 'language'],
    required: true,
  },
  proficiency: { type: Number, min: 0, max: 100, default: 80 },
  order: { type: Number, default: 0 },
})

module.exports = mongoose.model('Skill', skillSchema)
