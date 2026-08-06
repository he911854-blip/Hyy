import type { Project, Task } from '@prisma/client'

export interface ProjectAnalysis {
  summary: string
  risks: string[]
  suggestions: string[]
  stats: {
    totalTasks: number
    completedTasks: number
    overdueTasks: number
    highPriorityOpenTasks: number
    todoTasks: number
  }
}

// MVP 阶段使用规则型 Mock AI；后续可在此处替换为真实模型调用。
export function generateProjectAnalysis(project: Project, tasks: Task[]): ProjectAnalysis {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'DONE').length
  const todoTasks = tasks.filter((task) => task.status === 'TODO').length
  const highPriorityOpenTasks = tasks.filter((task) => task.priority === 'HIGH' && task.status !== 'DONE').length
  // 当前 Task 模型尚无截止日期字段，不能可靠判定延期任务。
  const overdueTasks = 0
  const risks: string[] = []
  const suggestions: string[] = []

  if (project.progress < 30 && totalTasks > 0) {
    risks.push(`项目当前进度仅为 ${project.progress}%，存在项目启动风险。`)
    suggestions.push('明确本周最小可交付目标，并为每项进行中任务指定负责人。')
  }
  if (highPriorityOpenTasks > 0) {
    risks.push(`存在 ${highPriorityOpenTasks} 个未完成的高优先级任务，需要重点关注。`)
    suggestions.push('优先处理高优先级任务，必要时减少并行工作以保障关键路径。')
  }
  if (todoTasks >= 3) {
    risks.push(`当前有 ${todoTasks} 个待处理任务，执行压力较高。`)
    suggestions.push('将待处理任务按依赖和优先级排序，分批安排进入执行队列。')
  }
  if (project.progress === 100 && totalTasks > 0) {
    suggestions.push('项目任务已全部完成，建议进入验收、复盘与交付归档流程。')
  }
  if (risks.length === 0) risks.push('当前未发现明显执行风险。')
  if (suggestions.length === 0) suggestions.push('保持当前节奏，持续更新任务状态以获得更准确的项目洞察。')

  const summary = project.progress === 100 && totalTasks > 0
    ? `项目「${project.name}」的 ${totalTasks} 个任务已全部完成，整体接近交付。`
    : `项目「${project.name}」当前进度为 ${project.progress}%，共 ${totalTasks} 个任务，已完成 ${completedTasks} 个。`

  return { summary, risks, suggestions, stats: { totalTasks, completedTasks, overdueTasks, highPriorityOpenTasks, todoTasks } }
}
