const mongoose = require('mongoose')

const experienceSchema = new mongoose.Schema({
  type: { type: String, enum: ['work', 'education'], required: true },
  title: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  location: { type: String, default: '' },
  startDate: { type: String, required: true },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
})

module.exports = mongoose.model('Experience', experienceSchema)
