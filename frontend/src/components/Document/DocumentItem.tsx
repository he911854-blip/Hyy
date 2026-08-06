import { FileText, Trash2 } from 'lucide-react'
import type { Document } from '../../services/api'
import { Button } from '../Button/Button'

const dateFormatter = new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

function formatSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentItem({ document, deleting = false, onDelete }: { document: Document; deleting?: boolean; onDelete: (document: Document) => void }) {
  return <li data-testid="document-item" className="flex items-center gap-3 px-5 py-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-indigo-50 text-primary"><FileText size={19} /></span><div className="min-w-0 flex-1"><p className="truncate font-medium text-slate-800">{document.filename}</p><p className="mt-1 truncate text-xs text-slate-500">{document.type || '未知类型'} · {formatSize(document.size)} · 上传于 {dateFormatter.format(new Date(document.createdAt))}</p></div><Button aria-label={`删除文件 ${document.filename}`} variant="outline" size="sm" disabled={deleting} className="shrink-0 text-rose-600 hover:text-rose-700" onClick={() => onDelete(document)}><Trash2 size={14} />删除</Button></li>
}
