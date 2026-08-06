import { ArrowLeft, FolderPlus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Card } from '../components/Card/Card'
import { ProjectForm } from '../components/Project/ProjectForm'
import { useState } from 'react'
import { createProject, type ProjectInput } from '../services/api'

export function CreateProjectPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  async function handleSubmit(values: ProjectInput) { setSubmitting(true); setError(''); try { const project = await createProject(values); navigate(`/projects/${project.id}`) } catch (reason) { setError(reason instanceof Error ? reason.message : '创建项目失败') } finally { setSubmitting(false) } }
  return <div className="mx-auto max-w-2xl space-y-6"><Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary"><ArrowLeft size={16} />返回项目列表</Link><section><p className="text-sm font-medium text-primary">New Project</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">创建项目</h1><p className="mt-2 text-sm text-slate-500">填写基础信息后，项目会立即保存到本地 SQLite 数据库。</p></section><Card className="p-6 sm:p-8"><div className="mb-7 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-primary"><FolderPlus size={20} /></span><div><h2 className="font-semibold text-slate-900">项目基础信息</h2><p className="text-xs text-slate-500">名称为必填项</p></div></div>{error && <p className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}<ProjectForm submitLabel="创建项目" submitting={submitting} onSubmit={handleSubmit} /></Card></div>
}
