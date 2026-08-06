import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core'
import { LayoutPanelTop } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import type { Task, TaskStatus } from '../../services/api'
import { getProjectTasks, updateTask } from '../../services/api'
import { Card } from '../Card/Card'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'

const columns: Array<{ status: TaskStatus; title: string }> = [{ status: 'TODO', title: '待处理' }, { status: 'DOING', title: '进行中' }, { status: 'DONE', title: '已完成' }]

export function KanbanBoard({ projectId, refreshKey = 0, onTasksChange }: { projectId: string; refreshKey?: number; onTasksChange?: () => void }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const loadTasks = useCallback(async () => { setLoading(true); setError(''); try { setTasks(await getProjectTasks(projectId)) } catch (reason) { setError(reason instanceof Error ? reason.message : '看板加载失败') } finally { setLoading(false) } }, [projectId])
  useEffect(() => { void loadTasks() }, [loadTasks, refreshKey])
  async function handleDragEnd(event: DragEndEvent) {
    const taskId = String(event.active.id)
    const nextStatus = event.over?.id as TaskStatus | undefined
    const task = tasks.find((item) => item.id === taskId)
    if (!task || !nextStatus || task.status === nextStatus || !columns.some((column) => column.status === nextStatus)) return
    const previousTasks = tasks
    setTasks((current) => current.map((item) => item.id === taskId ? { ...item, status: nextStatus } : item))
    try {
      const updated = await updateTask(taskId, { status: nextStatus })
      setTasks((current) => current.map((item) => item.id === taskId ? updated : item))
      onTasksChange?.()
    } catch (reason) {
      setTasks(previousTasks)
      setError(reason instanceof Error ? reason.message : '任务状态更新失败')
    }
  }
  return <section className="space-y-4"><div><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-primary"><LayoutPanelTop size={17} /></span><h2 className="font-semibold text-slate-900">任务看板</h2></div><p className="mt-2 text-xs text-slate-500">拖动卡片更新任务状态，项目进度将自动同步。</p></div>{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{loading ? <Card className="grid min-h-60 place-items-center text-sm text-slate-500">正在加载看板…</Card> : <div className="overflow-x-auto pb-2"><DndContext sensors={sensors} onDragEnd={handleDragEnd}><div className="grid min-w-180 grid-cols-3 gap-4">{columns.map((column) => { const columnTasks = tasks.filter((task) => task.status === column.status); return <KanbanColumn key={column.status} status={column.status} title={column.title} count={columnTasks.length}>{columnTasks.map((task) => <TaskCard key={task.id} task={task} />)}</KanbanColumn> })}</div></DndContext></div>}</section>
}
