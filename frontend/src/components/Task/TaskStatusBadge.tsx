import type { TaskPriority, TaskStatus } from '../../services/api'

const statusLabels: Record<TaskStatus, string> = { TODO: '待办', DOING: '进行中', DONE: '已完成' }
const statusStyles: Record<TaskStatus, string> = { TODO: 'bg-slate-100 text-slate-600', DOING: 'bg-blue-50 text-blue-700', DONE: 'bg-emerald-50 text-emerald-700' }
const priorityLabels: Record<TaskPriority, string> = { LOW: '低优先级', MEDIUM: '中优先级', HIGH: '高优先级' }
const priorityStyles: Record<TaskPriority, string> = { LOW: 'text-slate-500', MEDIUM: 'text-blue-600', HIGH: 'text-rose-600' }

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>{statusLabels[status]}</span>
}

export function TaskPriorityLabel({ priority }: { priority: TaskPriority }) {
  return <span className={`text-xs font-medium ${priorityStyles[priority]}`}>{priorityLabels[priority]}</span>
}
