import type { Prisma, TaskPriority, TaskStatus } from '@prisma/client'
import { prisma } from '../config/prisma.js'
import { recalculateProjectProgress } from './project.service.js'

export function listProjectTasks(projectId: string) {
  return prisma.task.findMany({ where: { projectId }, orderBy: { updatedAt: 'desc' } })
}

export function listTasks() {
  return prisma.task.findMany({ orderBy: { updatedAt: 'desc' }, include: { project: { select: { id: true, name: true } } } })
}

export function findTask(id: string) {
  return prisma.task.findUnique({ where: { id } })
}

export async function createTask(data: Prisma.TaskUncheckedCreateInput) {
  return prisma.$transaction(async (transaction) => {
    const task = await transaction.task.create({ data })
    await recalculateProjectProgress(transaction, task.projectId)
    return task
  })
}

export async function updateTask(id: string, data: { title?: string; description?: string; status?: TaskStatus; priority?: TaskPriority; assignee?: string }) {
  return prisma.$transaction(async (transaction) => {
    const task = await transaction.task.update({ where: { id }, data })
    await recalculateProjectProgress(transaction, task.projectId)
    return task
  })
}

export async function removeTask(id: string) {
  return prisma.$transaction(async (transaction) => {
    const task = await transaction.task.delete({ where: { id } })
    await recalculateProjectProgress(transaction, task.projectId)
    return task
  })
}
