const Experience = require('../models/Experience')

const getExperiences = async (req, res, next) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 })
    res.json(experiences)
  } catch (err) { next(err) }
}

const createExperience = async (req, res, next) => {
  try {
    const exp = await Experience.create(req.body)
    res.status(201).json(exp)
  } catch (err) { next(err) }
}

const updateExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!exp) { res.status(404); throw new Error('Experience not found') }
    res.json(exp)
  } catch (err) { next(err) }
}

const deleteExperience = async (req, res, next) => {
  try {
    const exp = await Experience.findByIdAndDelete(req.params.id)
    if (!exp) { res.status(404); throw new Error('Experience not found') }
    res.json({ message: 'Experience deleted' })
  } catch (err) { next(err) }
}

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience }
