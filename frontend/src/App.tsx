import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/Layout/AppLayout'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { DashboardPage } from './pages/DashboardPage'
import { CreateProjectPage } from './pages/CreateProjectPage'
import { CreateTaskPage } from './pages/CreateTaskPage'
import { EditProjectPage } from './pages/EditProjectPage'
import { EditTaskPage } from './pages/EditTaskPage'
import { LoginPage } from './pages/LoginPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { TasksPage } from './pages/TasksPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<CreateProjectPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/projects/:id/edit" element={<EditProjectPage />} />
        <Route path="/projects/:projectId/tasks/new" element={<CreateTaskPage />} />
        <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/ai" element={<AIAssistantPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  )
}
