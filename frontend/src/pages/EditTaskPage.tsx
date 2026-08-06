import { ArrowLeft, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/Card/Card'
import { TaskForm } from '../components/Task/TaskForm'
import { getTask, updateTask, type Task, type TaskInput } from '../services/api'

export function EditTaskPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState<Task | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => { void getTask(id).then(setTask).catch((reason) => setError(reason instanceof Error ? reason.message : '任务加载失败')) }, [id])
  async function handleSubmit(values: TaskInput) { setSubmitting(true); setError(''); try { const updated = await updateTask(id, values); navigate(`/projects/${updated.projectId}`) } catch (reason) { setError(reason instanceof Error ? reason.message : '任务更新失败') } finally { setSubmitting(false) } }
  if (error) return <Card className="p-6"><p className="text-sm text-rose-700">{error}</p></Card>
  if (!task) return <Card className="grid min-h-72 place-items-center text-sm text-slate-500">正在加载任务…</Card>
  return <div className="mx-auto max-w-2xl space-y-6"><Link to={`/projects/${task.projectId}`} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary"><ArrowLeft size={16} />返回项目详情</Link><section><p className="text-sm font-medium text-primary">Edit Task</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">编辑任务</h1><p className="mt-2 text-sm text-slate-500">更新任务后会自动重新计算所属项目进度。</p></section><Card className="p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-primary"><Pencil size={20} /></span><div><h2 className="font-semibold text-slate-900">{task.title}</h2><p className="text-xs text-slate-500">修改后将立即保存</p></div></div>{error && <p className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<TaskForm initialValues={task} submitLabel="保存修改" submitting={submitting} onSubmit={handleSubmit} /></Card></div>
}
