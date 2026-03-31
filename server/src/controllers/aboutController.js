const About = require('../models/About')

const getAbout = async (req, res, next) => {
  try {
    const about = await About.findOne()
    res.json(about || {})
  } catch (err) { next(err) }
}

const updateAbout = async (req, res, next) => {
  try {
    const about = await About.findOneAndUpdate(
      {},
      { ...req.body, updatedAt: Date.now() },
      { new: true, upsert: true, runValidators: true }
    )
    res.json(about)
  } catch (err) { next(err) }
}

module.exports = { getAbout, updateAbout }
