import type { NextFunction, Request, Response } from 'express'
import { generateProjectAnalysis } from '../services/ai.service.js'
import { findProject } from '../services/project.service.js'
import { generateProjectReport } from '../services/report.service.js'
import { listProjectTasks } from '../services/task.service.js'

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

export async function analyzeProject(request: Request, response: Response, next: NextFunction) {
  try {
    const projectId = (request.body as { projectId?: unknown }).projectId
    if (typeof projectId !== 'string' || !projectId) throw httpError('projectId 必填', 400)
    const project = await findProject(projectId)
    if (!project) throw httpError('项目不存在', 404)
    const tasks = await listProjectTasks(projectId)
    response.json({ success: true, data: generateProjectAnalysis(project, tasks) })
  } catch (error) { next(error) }
}

export async function createProjectReport(request: Request, response: Response, next: NextFunction) {
  try {
    const projectId = (request.body as { projectId?: unknown }).projectId
    if (typeof projectId !== 'string' || !projectId) throw httpError('projectId 必填', 400)
    const report = await generateProjectReport(projectId)
    if (!report) throw httpError('项目不存在', 404)
    response.json({ success: true, data: report })
  } catch (error) { next(error) }
}
