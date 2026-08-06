import { AlertTriangle, BarChart3, Bot, ClipboardList, Lightbulb, LoaderCircle, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProjectReportCard } from '../components/AI/ProjectReportCard'
import { Button } from '../components/Button/Button'
import { Card } from '../components/Card/Card'
import { analyzeProject, generateProjectReport, getProjects, type Project, type ProjectAnalysis, type ProjectReport } from '../services/api'

type LoadingAction = 'analysis' | 'report' | null

export function AIAssistantPage() {
  const [searchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('projectId') ?? '')
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null)
  const [report, setReport] = useState<ProjectReport | null>(null)
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingAction, setLoadingAction] = useState<LoadingAction>(null)
  const [error, setError] = useState('')
  const reportMode = searchParams.get('mode') === 'report'

  useEffect(() => {
    void getProjects().then((data) => {
      setProjects(data)
      setSelectedProjectId((current) => current || data[0]?.id || '')
    }).catch((reason) => setError(reason instanceof Error ? reason.message : '项目加载失败')).finally(() => setLoadingProjects(false))
  }, [])

  async function runAnalysis() {
    if (!selectedProjectId) return
    setLoadingAction('analysis')
    setError('')
    try { setAnalysis(await analyzeProject(selectedProjectId)) } catch (reason) { setError(reason instanceof Error ? reason.message : '分析生成失败') } finally { setLoadingAction(null) }
  }

  async function runReport() {
    if (!selectedProjectId) return
    setLoadingAction('report')
    setError('')
    try { setReport(await generateProjectReport(selectedProjectId)) } catch (reason) { setError(reason instanceof Error ? reason.message : '周报生成失败') } finally { setLoadingAction(null) }
  }

  useEffect(() => {
    if (reportMode && selectedProjectId && projects.some((project) => project.id === selectedProjectId)) void runReport()
  }, [reportMode, selectedProjectId, projects])

  return <div className="mx-auto max-w-5xl space-y-7"><section><p className="text-sm font-medium text-primary">AI Assistant</p><h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">AI 项目助手</h1><p className="mt-2 text-sm text-slate-500">基于真实项目、任务和资料数据生成规则型洞察与项目周报。</p></section><Card className="p-5 sm:p-6"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><Sparkles size={20} /></span><div className="min-w-0 flex-1"><h2 className="font-semibold text-slate-900">选择项目</h2><p className="mt-1 text-xs text-slate-500">MVP 阶段使用规则 + Mock AI，不调用真实大模型。</p><div className="mt-4 flex flex-col gap-3 sm:flex-row"><select aria-label="选择项目" value={selectedProjectId} disabled={loadingProjects || projects.length === 0} onChange={(event) => { setSelectedProjectId(event.target.value); setAnalysis(null); setReport(null) }} className="min-w-0 flex-1 rounded-xl border bg-white px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100"><option value="">请选择项目</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name} · {project.progress}%</option>)}</select><div className="flex gap-2"><Button type="button" disabled={!selectedProjectId || loadingAction !== null} onClick={() => void runAnalysis()}>{loadingAction === 'analysis' ? <><LoaderCircle className="animate-spin" size={16} />分析中…</> : <><Bot size={16} />分析项目</>}</Button><Button type="button" variant="outline" disabled={!selectedProjectId || loadingAction !== null} onClick={() => void runReport()}>{loadingAction === 'report' ? <><LoaderCircle className="animate-spin" size={16} />生成中…</> : <><ClipboardList size={16} />生成项目周报</>}</Button></div></div></div></div></Card>{error && <Card className="border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</Card>}{analysis && <section className="space-y-5"><div className="grid gap-4 sm:grid-cols-4">{[{ label: '任务总数', value: analysis.stats.totalTasks }, { label: '已完成', value: analysis.stats.completedTasks }, { label: '高优先级待办', value: analysis.stats.highPriorityOpenTasks }, { label: '延期任务', value: analysis.stats.overdueTasks }].map((stat) => <Card key={stat.label} className="p-4"><p className="text-xs text-slate-500">{stat.label}</p><p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p></Card>)}</div><Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-50 text-primary"><BarChart3 size={17} /></span><h2 className="font-semibold text-slate-900">项目总结</h2></div><p className="mt-4 leading-7 text-slate-700">{analysis.summary}</p></Card><div className="grid gap-5 lg:grid-cols-2"><Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-600"><AlertTriangle size={17} /></span><h2 className="font-semibold text-slate-900">风险提示</h2></div><ul className="mt-4 space-y-3">{analysis.risks.map((risk) => <li key={risk} className="rounded-xl bg-amber-50 px-3 py-2.5 text-sm leading-6 text-amber-900">{risk}</li>)}</ul></Card><Card className="p-5 sm:p-6"><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-600"><Lightbulb size={17} /></span><h2 className="font-semibold text-slate-900">行动建议</h2></div><ul className="mt-4 space-y-3">{analysis.suggestions.map((suggestion) => <li key={suggestion} className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm leading-6 text-emerald-900">{suggestion}</li>)}</ul></Card></div></section>}{report && <ProjectReportCard report={report} />}{!analysis && !report && !loadingProjects && !error && <Card className="grid min-h-45 place-items-center p-6 text-center"><div><span className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-primary"><Bot size={19} /></span><p className="mt-3 text-sm font-medium text-slate-700">选择一个项目开始生成</p><p className="mt-1 text-xs text-slate-500">周报内容会随项目任务和资料变化而更新。</p></div></Card>}</div>
}
