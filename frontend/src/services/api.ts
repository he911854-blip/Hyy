const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

export type ProjectStatus = 'PLANNING' | 'RUNNING' | 'COMPLETED'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  progress: number
  createdAt: string
  updatedAt: string
}

export interface ProjectInput {
  name: string
  description: string
  status: ProjectStatus
  progress?: number
}

export type TaskStatus = 'TODO' | 'DOING' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
}

export interface TaskWithProject extends Task {
  project: { id: string; name: string }
}

export interface DashboardRisk {
  projectId: string
  projectName: string
  message: string
}

export interface DashboardStats {
  projects: { total: number; running: number; completed: number; recent: Project[] }
  tasks: { total: number; completed: number; recent: TaskWithProject[] }
  completionRate: number
  risks: { count: number; items: DashboardRisk[] }
}

export interface DemoSeedResult {
  projects: number
  tasks: number
  documents: number
}

export interface Document {
  id: string
  projectId: string
  filename: string
  filepath: string
  type: string
  size: number
  createdAt: string
}

export interface ProjectAnalysis {
  summary: string
  risks: string[]
  suggestions: string[]
  stats: {
    totalTasks: number
    completedTasks: number
    overdueTasks: number
    highPriorityOpenTasks: number
    todoTasks: number
  }
}

export interface ProjectReport {
  title: string
  summary: string
  completedTasks: string[]
  risks: string[]
  nextSteps: string[]
}

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message) }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { headers: { 'Content-Type': 'application/json', ...options?.headers }, ...options })
  if (response.status === 204) return undefined as T
  const body = await response.json() as { success: boolean; data?: T; message?: string }
  if (!response.ok || !body.success) throw new ApiError(body.message ?? '请求失败，请稍后重试', response.status)
  return body.data as T
}

export function getProjects() { return request<Project[]>('/api/projects') }
export function getProject(id: string) { return request<Project>(`/api/projects/${id}`) }
export function createProject(data: ProjectInput) { return request<Project>('/api/projects', { method: 'POST', body: JSON.stringify(data) }) }
export function updateProject(id: string, data: ProjectInput) { return request<Project>(`/api/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
export function deleteProject(id: string) { return request<void>(`/api/projects/${id}`, { method: 'DELETE' }) }
export function getProjectTasks(projectId: string) { return request<Task[]>(`/api/projects/${projectId}/tasks`) }
export function getTasks() { return request<TaskWithProject[]>('/api/tasks') }
export function createTask(projectId: string, data: TaskInput) { return request<Task>(`/api/projects/${projectId}/tasks`, { method: 'POST', body: JSON.stringify(data) }) }
export function getTask(id: string) { return request<Task>(`/api/tasks/${id}`) }
export function updateTask(id: string, data: Partial<TaskInput>) { return request<Task>(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }) }
export function deleteTask(id: string) { return request<void>(`/api/tasks/${id}`, { method: 'DELETE' }) }
export function analyzeProject(projectId: string) { return request<ProjectAnalysis>('/api/ai/project-analysis', { method: 'POST', body: JSON.stringify({ projectId }) }) }
export function generateProjectReport(projectId: string) { return request<ProjectReport>('/api/ai/project-report', { method: 'POST', body: JSON.stringify({ projectId }) }) }
export function getDashboardStats() { return request<DashboardStats>('/api/dashboard/stats') }
export function seedDemoData() { return request<DemoSeedResult>('/api/demo/seed', { method: 'POST' }) }
export function getProjectDocuments(projectId: string) { return request<Document[]>(`/api/projects/${projectId}/documents`) }
export function deleteDocument(id: string) { return request<void>(`/api/documents/${id}`, { method: 'DELETE' }) }

export async function uploadDocument(projectId: string, file: File): Promise<Document> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(`${apiBaseUrl}/api/projects/${projectId}/documents`, { method: 'POST', body: formData })
  const body = await response.json() as { success: boolean; data?: Document; message?: string }
  if (!response.ok || !body.success) throw new ApiError(body.message ?? '文件上传失败，请稍后重试', response.status)
  return body.data as Document
}

export interface HealthResponse {
  success: boolean
  data: { status: string; timestamp: string; database: string }
}

export async function getHealth(): Promise<HealthResponse> {
  const response = await fetch(`${apiBaseUrl}/api/health`)
  if (!response.ok) throw new Error('服务暂不可用')
  return response.json() as Promise<HealthResponse>
}
