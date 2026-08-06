import { Router } from 'express'
import { deleteProject, getProject, getProjects, postProject, putProject } from '../controllers/project.controller.js'

export const projectRouter = Router()

projectRouter.route('/').get(getProjects).post(postProject)
projectRouter.route('/:id').get(getProject).put(putProject).delete(deleteProject)
