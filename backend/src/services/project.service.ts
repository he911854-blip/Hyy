import type { Prisma, ProjectStatus } from '@prisma/client'
import { prisma } from '../config/prisma.js'

export function listProjects() {
  return prisma.project.findMany({ orderBy: { updatedAt: 'desc' } })
}

export function findProject(id: string) {
  return prisma.project.findUnique({ where: { id } })
}

export function createProject(data: Prisma.ProjectCreateInput) {
  return prisma.project.create({ data })
}

export function updateProject(id: string, data: { name?: string; description?: string; status?: ProjectStatus; progress?: number }) {
  return prisma.project.update({ where: { id }, data })
}

export function removeProject(id: string) {
  return prisma.project.delete({ where: { id } })
}

export async function recalculateProjectProgress(database: Prisma.TransactionClient, projectId: string) {
  const [total, completed] = await Promise.all([
    database.task.count({ where: { projectId } }),
    database.task.count({ where: { projectId, status: 'DONE' } }),
  ])
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100)
  return database.project.update({ where: { id: projectId }, data: { progress } })
}
