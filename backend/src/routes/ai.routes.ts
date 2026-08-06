import { Router } from 'express'
import { analyzeProject, createProjectReport } from '../controllers/ai.controller.js'

export const aiRouter = Router()
aiRouter.post('/project-analysis', analyzeProject)
aiRouter.post('/project-report', createProjectReport)
