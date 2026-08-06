import { useState } from 'react'
import type { ProjectInput, ProjectStatus } from '../../services/api'
import { Button } from '../Button/Button'

const statusOptions: Array<{ value: ProjectStatus; label: string }> = [
  { value: 'PLANNING', label: '规划中' },
  { value: 'RUNNING', label: '进行中' },
  { value: 'COMPLETED', label: '已完成' },
]

interface ProjectFormProps {
  initialValues?: Partial<ProjectInput>
  showProgress?: boolean
  submitting?: boolean
  submitLabel: string
  onSubmit: (values: ProjectInput) => Promise<void>
}

export function ProjectForm({ initialValues, showProgress = false, submitting = false, submitLabel, onSubmit }: ProjectFormProps) {
  const [values, setValues] = useState<ProjectInput>({ name: initialValues?.name ?? '', description: initialValues?.description ?? '', status: initialValues?.status ?? 'PLANNING', progress: initialValues?.progress ?? 0 })
  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); void onSubmit(values) }}>
      <label className="block text-sm font-medium text-slate-700">项目名称<input value={values.name} onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" placeholder="例如：智慧商城 APP" required /></label>
      <label className="block text-sm font-medium text-slate-700">项目描述<textarea value={values.description} onChange={(event) => setValues((current) => ({ ...current, description: event.target.value }))} className="mt-2 block min-h-28 w-full resize-y rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" placeholder="简要说明项目目标、范围或当前背景" /></label>
      <label className="block text-sm font-medium text-slate-700">项目状态<select value={values.status} onChange={(event) => setValues((current) => ({ ...current, status: event.target.value as ProjectStatus }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100">{statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      {showProgress && <label className="block text-sm font-medium text-slate-700">项目进度<input value={values.progress ?? 0} onChange={(event) => setValues((current) => ({ ...current, progress: Number(event.target.value) }))} className="mt-2 block w-full rounded-xl border bg-white px-3.5 py-3 outline-none focus:border-primary focus:ring-3 focus:ring-indigo-100" type="number" min="0" max="100" step="1" required /></label>}
      <Button type="submit" disabled={submitting}>{submitting ? '保存中…' : submitLabel}</Button>
    </form>
  )
}
