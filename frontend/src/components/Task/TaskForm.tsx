import { useState } from 'react'
import type { TaskInput, TaskPriority, TaskStatus } from '../../services/api'
import { Button } from '../Button/Button'

const statusOptions: Array<{ value: TaskStatus; label: string }> = [{ value: 'TODO', label: '待办' }, { value: 'DOING', label: '进行中' }, { value: 'DONE', label: '已完成' }]
const priorityOptions: Array<{ value: TaskPriority; label: string }> = [{ value: 'LOW', label: '低' }, { value: 'MEDIUM', label: '中' }, { value: 'HIGH', label: '高' }]

interface TaskFormProps {
  initialValues?: Partial<TaskInput>
  submitting?: boolean
  submitLabel: string
  onSubmit: (values: TaskInput) => Promise<void>
}

export function TaskForm({ initialValues, submitting = false, submitLabel, onSubmit }: TaskFormProps) {
  const [values, setValues] = useState<TaskInput>({ title: initialValues?.title ?? '', description: initialValues?.description ?? '', status: initialValues?.status ?? 'TODO', priority: initialValues?.priority ?? 'MEDIUM', assignee: initialValues?.assignee ?? '' })
  return <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void onSubmit(values) }}><label className="block text-sm font-medium text-slate-700">任务名称<input value={values.title} onChange={(event) => setValues((current) => ({ ...current, title: event.target.value }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" placeholder="例如：完成首页交互设计" required /></label><label className="block text-sm font-medium text-slate-700">任务描述<textarea value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} className="mt-2 block min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" placeholder="补充任务背景、验收标准或上下文" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700">任务状态<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as TaskStatus }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label><label className="block text-sm font-medium text-slate-700">优先级<select value={values.priority} onChange={(event) => setValues((current) => ({ ...current, priority: event.target.value as TaskPriority }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100">{priorityOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label></div><label className="block text-sm font-medium text-slate-700">负责人<input value={values.assignee} onChange={(event) => setValues((current) => ({ ...current, assignee: event.target.value }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" placeholder="例如：张小明" /></label><Button type="submit" disabled={submitting}>{submitting ? '保存中…' : submitLabel}</Button></form>
}
