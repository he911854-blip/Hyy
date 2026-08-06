import { ArrowLeft, Bot, CalendarDays, ClipboardList, Pencil, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { DocumentList } from '../components/Document/DocumentList'
import { KanbanBoard } from '../components/Kanban/KanbanBoard'
import { ProjectStatusBadge } from '../components/Project/ProjectStatusBadge'
import { TaskList } from '../components/Task/TaskList'
import { deleteProject, getProject, type Project } from '../services/api'

const formatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

export function ProjectDetailPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<Project | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [taskVersion, setTaskVersion] = useState(0)
  const loadProject = useCallback(async () => { setLoading(true); setError(''); try { setProject(await getProject(id)) } catch (reason) { setError(reason instanceof Error ? reason.message : '项目加载失败') } finally { setLoading(false) } }, [id])
  useEffect(() => { void loadProject() }, [loadProject])
  const handleTasksChange = useCallback(() => { void loadProject(); setTaskVersion((version) => version + 1) }, [loadProject])
  async function handleDelete() { if (!project) return; try { await deleteProject(project.id); navigate('/projects') } catch (reason) { setError(reason instanceof Error ? reason.message : '项目删除失败') } }
  if (loading) return <Card className="grid min-h-72 place-items-center text-sm text-slate-500">正在加载项目…</Card>
  if (error || !project) return <Card className="p-6"><p className="text-sm text-rose-700">{error || '项目不存在'}</p><Button asChild variant="outline" className="mt-4"><Link to="/projects">返回项目列表</Link></Button></Card>
  return <div className="mx-auto max-w-6xl space-y-6"><Link to="/projects" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-primary"><ArrowLeft size={16} />返回项目列表</Link><Card className="overflow-hidden"><div className="border-b bg-slate-50/70 p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><ProjectStatusBadge status={project.status} /><h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">{project.name}</h1></div><div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" asChild><Link to={`/ai?projectId=${project.id}`}><Bot size={14} />AI分析项目</Link></Button><Button variant="outline" size="sm" asChild><Link to={`/ai?projectId=${project.id}&mode=report`}><ClipboardList size={14} />生成项目周报</Link></Button><Button variant="outline" size="sm" asChild><Link to={`/projects/${project.id}/edit`}><Pencil size={14} />编辑</Link></Button><Button variant="outline" size="sm" className="text-rose-600 hover:text-rose-700" onClick={() => void handleDelete()}><Trash2 size={14} />删除</Button></div></div></div><div className="space-y-8 p-6 sm:p-8"><section><h2 className="text-sm font-medium text-slate-500">项目描述</h2><p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">{project.description || '暂无项目描述'}</p></section><section><div className="flex justify-between text-sm"><div><h2 className="font-medium text-slate-700">项目进度</h2><p className="mt-1 text-xs text-slate-500">按已完成任务 / 总任务数自动计算</p></div><span className="font-semibold text-primary">{project.progress}%</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-primary" style={{ width: `${project.progress}%` }} /></div></section><section className="grid gap-4 border-t pt-6 text-sm text-slate-500 sm:grid-cols-2"><p className="flex items-center gap-2"><CalendarDays size={16} />创建于 {formatter.format(new Date(project.createdAt))}</p><p>最后更新：{formatter.format(new Date(project.updatedAt))}</p></section></div></Card><KanbanBoard projectId={project.id} refreshKey={taskVersion} onTasksChange={handleTasksChange} /><TaskList projectId={project.id} refreshKey={taskVersion} onTasksChange={handleTasksChange} /><DocumentList projectId={project.id} /></div>
}
