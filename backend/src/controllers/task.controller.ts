import { TaskPriority, TaskStatus } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { findProject } from '../services/project.service.js'
import { createTask, findTask, listProjectTasks, listTasks, removeTask, updateTask } from '../services/task.service.js'

const statuses = new Set(Object.values(TaskStatus))
const priorities = new Set(Object.values(TaskPriority))

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

function getParam(request: Request, name: string) {
  const value = request.params[name]
  if (typeof value !== 'string') throw httpError(`${name} 无效`, 400)
  return value
}

function parseTaskInput(body: unknown, isCreate = false) {
  const input = body as Record<string, unknown>
  const data: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority; assignee?: string } = {}
  if (isCreate && (typeof input.title !== 'string' || !input.title.trim())) throw httpError('任务名称不能为空', 400)
  if (typeof input.title === 'string') data.title = input.title.trim()
  if ('description' in input) { if (typeof input.description !== 'string') throw httpError('任务描述必须是字符串', 400); data.description = input.description.trim() }
  if ('assignee' in input) { if (typeof input.assignee !== 'string') throw httpError('负责人必须是字符串', 400); data.assignee = input.assignee.trim() }
  if ('status' in input) { if (typeof input.status !== 'string' || !statuses.has(input.status as TaskStatus)) throw httpError('任务状态无效', 400); data.status = input.status as TaskStatus }
  if ('priority' in input) { if (typeof input.priority !== 'string' || !priorities.has(input.priority as TaskPriority)) throw httpError('任务优先级无效', 400); data.priority = input.priority as TaskPriority }
  if (!isCreate && Object.keys(data).length === 0) throw httpError('请提供需要更新的字段', 400)
  return data
}

export async function getProjectTasks(request: Request, response: Response, next: NextFunction) {
  try {
    const projectId = getParam(request, 'projectId')
    if (!await findProject(projectId)) throw httpError('项目不存在', 404)
    response.json({ success: true, data: await listProjectTasks(projectId) })
  } catch (error) { next(error) }
}

export async function getTasks(_request: Request, response: Response, next: NextFunction) {
  try { response.json({ success: true, data: await listTasks() }) } catch (error) { next(error) }
}

export async function postProjectTask(request: Request, response: Response, next: NextFunction) {
  try {
    const projectId = getParam(request, 'projectId')
    if (!await findProject(projectId)) throw httpError('项目不存在', 404)
    const input = parseTaskInput(request.body, true) as { title: string; description?: string; status?: TaskStatus; priority?: TaskPriority; assignee?: string }
    const task = await createTask({ projectId, ...input })
    response.status(201).json({ success: true, data: task })
  } catch (error) { next(error) }
}

export async function getTask(request: Request, response: Response, next: NextFunction) {
  try {
    const task = await findTask(getParam(request, 'id'))
    if (!task) throw httpError('任务不存在', 404)
    response.json({ success: true, data: task })
  } catch (error) { next(error) }
}

export async function putTask(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getParam(request, 'id')
    if (!await findTask(id)) throw httpError('任务不存在', 404)
    response.json({ success: true, data: await updateTask(id, parseTaskInput(request.body)) })
  } catch (error) { next(error) }
}

export async function deleteTask(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getParam(request, 'id')
    if (!await findTask(id)) throw httpError('任务不存在', 404)
    await removeTask(id)
    response.status(204).send()
  } catch (error) { next(error) }
}
