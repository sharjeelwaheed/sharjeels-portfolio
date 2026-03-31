const Skill = require('../models/Skill')

const getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.find().sort({ order: 1 })
    res.json(skills)
  } catch (err) { next(err) }
}

const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body)
    res.status(201).json(skill)
  } catch (err) { next(err) }
}

const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!skill) { res.status(404); throw new Error('Skill not found') }
    res.json(skill)
  } catch (err) { next(err) }
}

const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id)
    if (!skill) { res.status(404); throw new Error('Skill not found') }
    res.json({ message: 'Skill deleted' })
  } catch (err) { next(err) }
}

module.exports = { getSkills, createSkill, updateSkill, deleteSkill }
