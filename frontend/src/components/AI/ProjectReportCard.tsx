import { AlertTriangle, CheckCircle2, ClipboardList, ListTodo } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ProjectReport } from '../../services/api'
import { Card } from '../Card/Card'

function ReportSection({ icon, title, items, emptyMessage, tone }: { icon: ReactNode; title: string; items: string[]; emptyMessage: string; tone: 'emerald' | 'amber' | 'indigo' }) {
  const tones = { emerald: 'bg-emerald-50 text-emerald-800', amber: 'bg-amber-50 text-amber-900', indigo: 'bg-indigo-50 text-indigo-800' }
  return <section><div className="flex items-center gap-2"><span className={`grid h-8 w-8 place-items-center rounded-lg ${tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : tone === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-primary'}`}>{icon}</span><h3 className="font-medium text-slate-900">{title}</h3></div><ul className="mt-3 space-y-2">{items.length > 0 ? items.map((item) => <li key={item} className={`rounded-xl px-3 py-2.5 text-sm leading-6 ${tones[tone]}`}>{item}</li>) : <li className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-500">{emptyMessage}</li>}</ul></section>
}

export function ProjectReportCard({ report }: { report: ProjectReport }) {
  return <Card className="overflow-hidden"><div className="border-b bg-slate-50/70 p-5 sm:p-6"><div className="flex items-center gap-2"><span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-50 text-violet-600"><ClipboardList size={18} /></span><div><p className="text-xs font-medium text-violet-600">规则型 AI 周报</p><h2 className="font-semibold text-slate-900">{report.title}</h2></div></div><p className="mt-4 leading-7 text-slate-700">{report.summary}</p></div><div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-3"><ReportSection icon={<CheckCircle2 size={17} />} title="完成事项" items={report.completedTasks} emptyMessage="本周暂无已完成任务。" tone="emerald" /><ReportSection icon={<AlertTriangle size={17} />} title="风险提示" items={report.risks} emptyMessage="当前未发现风险。" tone="amber" /><ReportSection icon={<ListTodo size={17} />} title="下一步计划" items={report.nextSteps} emptyMessage="暂无下一步计划。" tone="indigo" /></div></Card>
}
