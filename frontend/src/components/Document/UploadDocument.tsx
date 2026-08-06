import { FileUp, Upload } from 'lucide-react'
import { useId, useState } from 'react'
import { uploadDocument } from '../../services/api'
import { Button } from '../Button/Button'

export function UploadDocument({ projectId, onUploaded }: { projectId: string; onUploaded: () => void }) {
  const inputId = useId()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function submit() {
    if (!file) { setError('请先选择文件'); return }
    setUploading(true)
    setError('')
    try { await uploadDocument(projectId, file); setFile(null); onUploaded() } catch (reason) { setError(reason instanceof Error ? reason.message : '文件上传失败') } finally { setUploading(false) }
  }

  return <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><input id={inputId} aria-label="选择项目文件" type="file" className="sr-only" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setError('') }} /><label htmlFor={inputId} className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"><FileUp size={16} />选择文件</label><p className="min-w-0 flex-1 truncate text-sm text-slate-500">{file ? file.name : '单个文件最大 10 MB'}</p><Button type="button" disabled={!file || uploading} onClick={() => void submit()}><Upload size={16} />{uploading ? '上传中…' : '上传文件'}</Button></div>{error && <p className="mt-3 text-sm text-rose-700">{error}</p>}</div>
}
