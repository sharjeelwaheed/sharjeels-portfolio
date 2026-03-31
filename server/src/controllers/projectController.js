const Project = require('../models/Project')

// Public: visible projects only
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ visible: true }).sort({ order: 1, createdAt: -1 })
    res.json(projects)
  } catch (err) { next(err) }
}

// Admin: all projects
const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    res.json(projects)
  } catch (err) { next(err) }
}

const getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) { res.status(404); throw new Error('Project not found') }
    res.json(project)
  } catch (err) { next(err) }
}

const createProject = async (req, res, next) => {
  try {
    const project = await Project.create(req.body)
    res.status(201).json(project)
  } catch (err) { next(err) }
}

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) { res.status(404); throw new Error('Project not found') }
    res.json(project)
  } catch (err) { next(err) }
}

const toggleVisibility = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) { res.status(404); throw new Error('Project not found') }
    project.visible = !project.visible
    await project.save()
    res.json({ visible: project.visible })
  } catch (err) { next(err) }
}

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) { res.status(404); throw new Error('Project not found') }
    res.json({ message: 'Project deleted' })
  } catch (err) { next(err) }
}

module.exports = { getProjects, getAllProjects, getProject, createProject, updateProject, toggleVisibility, deleteProject }
