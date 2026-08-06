import { access, unlink } from 'node:fs/promises'
import path from 'node:path'
import type { Prisma } from '@prisma/client'
import { prisma } from '../config/prisma.js'

export function listProjectDocuments(projectId: string) {
  return prisma.document.findMany({ where: { projectId }, orderBy: { createdAt: 'desc' } })
}

export function findDocument(id: string) {
  return prisma.document.findUnique({ where: { id } })
}

export function createDocument(data: Prisma.DocumentUncheckedCreateInput) {
  return prisma.document.create({ data })
}

export function removeDocument(id: string) {
  return prisma.document.delete({ where: { id } })
}

export async function removeLocalFile(filepath: string) {
  const absolutePath = path.resolve(process.cwd(), filepath)
  try { await access(absolutePath); await unlink(absolutePath) } catch { /* 文件已不存在时无需阻断资料记录删除 */ }
}
