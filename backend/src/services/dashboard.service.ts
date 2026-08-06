import { prisma } from '../config/prisma.js'

export interface DashboardRisk {
  projectId: string
  projectName: string
  message: string
}

export async function getDashboardStats() {
  const [projectTotal, runningProjects, completedProjects, taskTotal, completedTasks, recentProjects, recentTasks, projectsWithTasks] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: 'RUNNING' } }),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.task.count(),
    prisma.task.count({ where: { status: 'DONE' } }),
    prisma.project.findMany({ orderBy: { updatedAt: 'desc' }, take: 4 }),
    prisma.task.findMany({ orderBy: { updatedAt: 'desc' }, take: 5, include: { project: { select: { id: true, name: true } } } }),
    prisma.project.findMany({ include: { tasks: { select: { status: true, priority: true } } } }),
  ])

  const risks: DashboardRisk[] = []
  for (const project of projectsWithTasks) {
    const highPriorityOpen = project.tasks.filter((task) => task.priority === 'HIGH' && task.status !== 'DONE').length
    const todoTasks = project.tasks.filter((task) => task.status === 'TODO').length
    if (highPriorityOpen > 0) risks.push({ projectId: project.id, projectName: project.name, message: `${highPriorityOpen} 个高优先级任务尚未完成。` })
    if (project.progress < 30 && project.tasks.length > 0) risks.push({ projectId: project.id, projectName: project.name, message: `项目进度仅 ${project.progress}%，需关注启动节奏。` })
    if (todoTasks >= 3) risks.push({ projectId: project.id, projectName: project.name, message: `${todoTasks} 个任务仍在待办队列。` })
  }

  return {
    projects: { total: projectTotal, running: runningProjects, completed: completedProjects, recent: recentProjects },
    tasks: { total: taskTotal, completed: completedTasks, recent: recentTasks },
    completionRate: taskTotal === 0 ? 0 : Math.round((completedTasks / taskTotal) * 100),
    risks: { count: risks.length, items: risks.slice(0, 4) },
  }
}
