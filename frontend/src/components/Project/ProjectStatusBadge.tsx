import type { ProjectStatus } from '../../services/api'

const labels: Record<ProjectStatus, string> = { PLANNING: '规划中', RUNNING: '进行中', COMPLETED: '已完成' }
const styles: Record<ProjectStatus, string> = { PLANNING: 'bg-violet-50 text-violet-700', RUNNING: 'bg-blue-50 text-blue-700', COMPLETED: 'bg-emerald-50 text-emerald-700' }

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>{labels[status]}</span>
}
