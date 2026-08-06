import { prisma } from '../config/prisma.js'

export interface ProjectReport {
  title: string
  summary: string
  completedTasks: string[]
  risks: string[]
  nextSteps: string[]
}

// MVP 阶段使用确定性的业务规则生成周报；后续可替换为真实 LLM 总结。
export async function generateProjectReport(projectId: string): Promise<ProjectReport | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: { orderBy: { updatedAt: 'desc' } },
      _count: { select: { documents: true } },
    },
  })
  if (!project) return null

  const totalTasks = project.tasks.length
  const completed = project.tasks.filter((task) => task.status === 'DONE')
  const openTasks = project.tasks.filter((task) => task.status !== 'DONE')
  const highPriorityOpenTasks = openTasks.filter((task) => task.priority === 'HIGH')
  const todoTasks = project.tasks.filter((task) => task.status === 'TODO')
  const risks: string[] = []

  if (highPriorityOpenTasks.length > 0) risks.push(`存在 ${highPriorityOpenTasks.length} 个未完成的高优先级任务，需要优先跟进。`)
  if (project.progress < 30) risks.push(`项目当前进度为 ${project.progress}%，低于 30%，需关注项目启动与交付节奏。`)
  if (todoTasks.length >= 3) risks.push(`当前有 ${todoTasks.length} 个待处理任务，执行队列压力较高。`)
  if (risks.length === 0) risks.push('当前未发现明显项目风险。')

  const nextSteps = openTasks.slice(0, 3).map((task) => `推进「${task.title}」${task.assignee ? `，负责人：${task.assignee}` : '，请尽快明确负责人'}。`)
  if (nextSteps.length === 0) nextSteps.push('任务已全部完成，建议进入验收、复盘与资料归档。')

  return {
    title: `项目周报｜${project.name}`,
    summary: `项目「${project.name}」当前进度 ${project.progress}%，共 ${totalTasks} 个任务，已完成 ${completed.length} 个，未完成 ${openTasks.length} 个；项目资料共 ${project._count.documents} 份。`,
    completedTasks: completed.map((task) => task.title),
    risks,
    nextSteps,
  }
}
