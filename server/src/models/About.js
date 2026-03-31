const mongoose = require('mongoose')

const aboutSchema = new mongoose.Schema({
  bio: { type: String, required: true },
  tagline: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  stats: [
    {
      label: { type: String },
      value: { type: String },
    },
  ],
  highlights: [
    {
      icon: { type: String },
      text: { type: String },
    },
  ],
  resumeUrl: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('About', aboutSchema)
