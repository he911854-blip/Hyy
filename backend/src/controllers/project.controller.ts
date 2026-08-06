import { ProjectStatus } from '@prisma/client'
import type { NextFunction, Request, Response } from 'express'
import { createProject, findProject, listProjects, removeProject, updateProject } from '../services/project.service.js'

const statuses = new Set(Object.values(ProjectStatus))

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

function getProjectId(request: Request) {
  const { id } = request.params
  if (typeof id !== 'string') throw httpError('项目 ID 无效', 400)
  return id
}

function parseProjectInput(body: unknown, isCreate = false) {
  const input = body as Record<string, unknown>
  const data: { name?: string; description?: string; status?: ProjectStatus; progress?: number } = {}

  if (isCreate && (typeof input.name !== 'string' || !input.name.trim())) throw httpError('项目名称不能为空', 400)
  if (typeof input.name === 'string') data.name = input.name.trim()
  if ('description' in input) {
    if (typeof input.description !== 'string') throw httpError('项目描述必须是字符串', 400)
    data.description = input.description.trim()
  }
  if ('status' in input) {
    if (typeof input.status !== 'string' || !statuses.has(input.status as ProjectStatus)) throw httpError('项目状态无效', 400)
    data.status = input.status as ProjectStatus
  }
  if ('progress' in input) {
    if (typeof input.progress !== 'number' || !Number.isInteger(input.progress) || input.progress < 0 || input.progress > 100) throw httpError('项目进度必须是 0 到 100 的整数', 400)
    data.progress = input.progress
  }
  if (!isCreate && Object.keys(data).length === 0) throw httpError('请提供需要更新的字段', 400)
  return data
}

export async function getProjects(_request: Request, response: Response, next: NextFunction) {
  try { response.json({ success: true, data: await listProjects() }) } catch (error) { next(error) }
}

export async function getProject(request: Request, response: Response, next: NextFunction) {
  try {
    const project = await findProject(getProjectId(request))
    if (!project) throw httpError('项目不存在', 404)
    response.json({ success: true, data: project })
  } catch (error) { next(error) }
}

export async function postProject(request: Request, response: Response, next: NextFunction) {
  try { response.status(201).json({ success: true, data: await createProject(parseProjectInput(request.body, true) as { name: string; description?: string; status?: ProjectStatus; progress?: number }) }) } catch (error) { next(error) }
}

export async function putProject(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getProjectId(request)
    if (!await findProject(id)) throw httpError('项目不存在', 404)
    response.json({ success: true, data: await updateProject(id, parseProjectInput(request.body)) })
  } catch (error) { next(error) }
}

export async function deleteProject(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getProjectId(request)
    if (!await findProject(id)) throw httpError('项目不存在', 404)
    await removeProject(id)
    response.status(204).send()
  } catch (error) { next(error) }
}
