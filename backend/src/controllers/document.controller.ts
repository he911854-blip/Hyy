import { unlink } from 'node:fs/promises'
import path from 'node:path'
import type { NextFunction, Request, Response } from 'express'
import { findProject } from '../services/project.service.js'
import { createDocument, findDocument, listProjectDocuments, removeDocument, removeLocalFile } from '../services/document.service.js'

function httpError(message: string, statusCode: number) {
  return Object.assign(new Error(message), { statusCode })
}

function getParam(request: Request, name: string) {
  const value = request.params[name]
  if (typeof value !== 'string') throw httpError(`${name} 无效`, 400)
  return value
}

export async function getProjectDocuments(request: Request, response: Response, next: NextFunction) {
  try {
    const projectId = getParam(request, 'projectId')
    if (!await findProject(projectId)) throw httpError('项目不存在', 404)
    response.json({ success: true, data: await listProjectDocuments(projectId) })
  } catch (error) { next(error) }
}

export async function postProjectDocument(request: Request, response: Response, next: NextFunction) {
  const file = request.file
  try {
    const projectId = getParam(request, 'projectId')
    if (!await findProject(projectId)) throw httpError('项目不存在', 404)
    if (!file) throw httpError('请选择要上传的文件', 400)
    const document = await createDocument({ projectId, filename: file.originalname, filepath: path.posix.join('uploads', file.filename), type: file.mimetype || 'application/octet-stream', size: file.size })
    response.status(201).json({ success: true, data: document })
  } catch (error) {
    if (file) await unlink(file.path).catch(() => undefined)
    next(error)
  }
}

export async function deleteDocument(request: Request, response: Response, next: NextFunction) {
  try {
    const id = getParam(request, 'id')
    const document = await findDocument(id)
    if (!document) throw httpError('文件不存在', 404)
    await removeDocument(id)
    await removeLocalFile(document.filepath)
    response.status(204).send()
  } catch (error) { next(error) }
}
