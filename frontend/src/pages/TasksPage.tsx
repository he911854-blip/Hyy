import { CheckSquare, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { TaskPriorityLabel, TaskStatusBadge } from '../components/Task/TaskStatusBadge'
import { getTasks, type TaskWithProject } from '../services/api'

export function TasksPage() {
  const [tasks, setTasks] = useState<TaskWithProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const loadTasks = useCallback(async () => { setLoading(true); setError(''); try { setTasks(await getTasks()) } catch (reason) { setError(reason instanceof Error ? reason.message : '任务加载失败') } finally { setLoading(false) } }, [])
  useEffect(() => { void loadTasks() }, [loadTasks])
  return <div className="space-y-7"><section><p className="text-sm font-medium text-primary">Tasks</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">任务中心</h1><p className="mt-2 text-sm text-slate-500">实时跟踪所有项目中的任务状态与优先级。</p></section>{error && <Card className="flex flex-col gap-3 border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 sm:flex-row sm:items-center sm:justify-between"><span>{error}</span><Button variant="outline" size="sm" onClick={() => void loadTasks()}><RefreshCw size={14} />重试</Button></Card>}{loading ? <Card className="grid min-h-72 place-items-center text-sm text-slate-500">正在加载任务…</Card> : tasks.length === 0 ? <Card className="grid min-h-72 place-items-center p-6 text-center"><div><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-primary"><CheckSquare size={19} /></span><p className="mt-3 text-sm font-medium text-slate-700">还没有任务</p><p className="mt-1 text-xs text-slate-500">请先进入项目详情创建任务。</p></div></Card> : <Card className="overflow-hidden"><div className="border-b px-5 py-4"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-primary"><CheckSquare size={17} /></span><div><h2 className="font-semibold text-slate-900">全部任务</h2><p className="text-xs text-slate-500">共 {tasks.length} 个真实任务</p></div></div></div><div className="overflow-x-auto"><table className="w-full min-w-175 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-medium">任务名称</th><th className="px-5 py-3 font-medium">所属项目</th><th className="px-5 py-3 font-medium">状态</th><th className="px-5 py-3 font-medium">优先级</th></tr></thead><tbody className="divide-y">{tasks.map((task) => <tr key={task.id} className="transition-colors hover:bg-slate-50"><td className="px-5 py-4 font-medium text-slate-800">{task.title}</td><td className="px-5 py-4"><Link to={`/projects/${task.project.id}`} className="text-slate-500 hover:text-primary">{task.project.name}</Link></td><td className="px-5 py-4"><TaskStatusBadge status={task.status} /></td><td className="px-5 py-4"><TaskPriorityLabel priority={task.priority} /></td></tr>)}</tbody></table></div></Card>}</div>
}
