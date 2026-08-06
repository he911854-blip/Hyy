import { useDraggable } from '@dnd-kit/core'
import { GripVertical, UserRound } from 'lucide-react'
import type { Task } from '../../services/api'
import { TaskPriorityLabel } from '../Task/TaskStatusBadge'

export function TaskCard({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id, data: { task } })
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined
  return <article ref={setNodeRef} style={style} data-testid={`kanban-task-${task.id}`} className={`rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${isDragging ? 'z-10 opacity-40 shadow-lg' : ''}`} {...attributes} {...listeners}><div className="flex items-start gap-2"><GripVertical className="mt-0.5 shrink-0 cursor-grab text-slate-300 active:cursor-grabbing" size={16} /><p className="min-w-0 flex-1 text-sm font-medium leading-5 text-slate-800">{task.title}</p></div><div className="mt-4 flex items-center justify-between gap-2"><TaskPriorityLabel priority={task.priority} /><span className="flex items-center gap-1 text-xs text-slate-500"><UserRound size={13} />{task.assignee || '未分配'}</span></div></article>
}
