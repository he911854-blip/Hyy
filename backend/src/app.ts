import cors from 'cors'
import express from 'express'
import { env } from './config/env.js'
import { aiRouter } from './routes/ai.routes.js'
import { dashboardRouter } from './routes/dashboard.routes.js'
import { demoRouter } from './routes/demo.routes.js'
import { documentRouter, projectDocumentRouter } from './routes/document.routes.js'
import { errorHandler } from './middleware/error-handler.js'
import { healthRouter } from './routes/health.routes.js'
import { projectRouter } from './routes/project.routes.js'
import { projectTaskRouter, taskRouter } from './routes/task.routes.js'

export const app = express()

app.use(cors({ origin: env.clientOrigins }))
app.use(express.json())
app.use('/api/health', healthRouter)
app.use('/api/ai', aiRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/demo', demoRouter)
app.use('/api/projects', projectRouter)
app.use('/api/projects/:projectId/tasks', projectTaskRouter)
app.use('/api/projects/:projectId/documents', projectDocumentRouter)
app.use('/api/tasks', taskRouter)
app.use('/api/documents', documentRouter)
app.use(errorHandler)
