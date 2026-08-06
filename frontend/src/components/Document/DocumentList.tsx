import { FolderOpen } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { deleteDocument, getProjectDocuments, type Document } from '../../services/api'
import { Card } from '../Card/Card'
import { DocumentItem } from './DocumentItem'
import { UploadDocument } from './UploadDocument'

export function DocumentList({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const loadDocuments = useCallback(async () => { setLoading(true); setError(''); try { setDocuments(await getProjectDocuments(projectId)) } catch (reason) { setError(reason instanceof Error ? reason.message : '资料加载失败') } finally { setLoading(false) } }, [projectId])
  useEffect(() => { void loadDocuments() }, [loadDocuments])
  async function remove(document: Document) { setDeletingId(document.id); setError(''); try { await deleteDocument(document.id); setDocuments((items) => items.filter((item) => item.id !== document.id)) } catch (reason) { setError(reason instanceof Error ? reason.message : '文件删除失败') } finally { setDeletingId('') } }

  return <section className="space-y-4"><div><h2 className="font-semibold text-slate-900">项目资料</h2><p className="mt-1 text-xs text-slate-500">上传和管理项目相关文件，单个文件最大 10 MB。</p></div><UploadDocument projectId={projectId} onUploaded={() => void loadDocuments()} />{error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}{loading ? <Card className="grid min-h-32 place-items-center text-sm text-slate-500">正在加载项目资料…</Card> : documents.length === 0 ? <Card className="grid min-h-32 place-items-center p-6 text-center"><div><span className="mx-auto grid h-9 w-9 place-items-center rounded-lg bg-indigo-50 text-primary"><FolderOpen size={18} /></span><p className="mt-3 text-sm font-medium text-slate-700">还没有项目资料</p><p className="mt-1 text-xs text-slate-500">选择文件后即可上传到本地资料库。</p></div></Card> : <Card className="overflow-hidden"><ul className="divide-y">{documents.map((document) => <DocumentItem key={document.id} document={document} deleting={deletingId === document.id} onDelete={(item) => void remove(item)} />)}</ul></Card>}</section>
}
