import { ArrowLeft, CheckSquare } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card } from '../components/Card/Card'
import { TaskForm } from '../components/Task/TaskForm'
import { createTask, type TaskInput } from '../services/api'

export function CreateTaskPage() {
  const { projectId = '' } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  async function handleSubmit(values: TaskInput) { setSubmitting(true); setError(''); try { await createTask(projectId, values); navigate(`/projects/${projectId}`) } catch (reason) { setError(reason instanceof Error ? reason.message : '创建任务失败') } finally { setSubmitting(false) } }
  return <div className="mx-auto max-w-2xl space-y-6"><Link to={`/projects/${projectId}`} className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary"><ArrowLeft size={16} />返回项目详情</Link><section><p className="text-sm font-medium text-primary">New Task</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">新建任务</h1><p className="mt-2 text-sm text-slate-500">任务保存后会自动重新计算项目进度。</p></section><Card className="p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-primary"><CheckSquare size={20} /></span><div><h2 className="font-semibold text-slate-900">任务信息</h2><p className="text-xs text-slate-500">任务名称为必填项</p></div></div>{error && <p className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<TaskForm submitLabel="创建任务" submitting={submitting} onSubmit={handleSubmit} /></Card></div>
}
