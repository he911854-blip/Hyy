import { useDroppable } from '@dnd-kit/core'
import type { ReactNode } from 'react'
import type { TaskStatus } from '../../services/api'

const accentStyles: Record<TaskStatus, string> = { TODO: 'bg-slate-400', DOING: 'bg-blue-500', DONE: 'bg-emerald-500' }

export function KanbanColumn({ status, title, count, children }: { status: TaskStatus; title: string; count: number; children: ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({ id: status })
  return <section ref={setNodeRef} data-testid={`kanban-column-${status}`} className={`min-h-100 rounded-2xl border p-3 transition-colors ${isOver ? 'border-primary bg-indigo-50/70' : 'border-slate-200 bg-slate-100/70'}`}><header className="flex items-center justify-between px-1 py-2"><div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${accentStyles[status]}`} /><h3 className="text-sm font-semibold text-slate-700">{title}</h3></div><span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{count}</span></header><div className="mt-2 space-y-3">{children}</div></section>
}
