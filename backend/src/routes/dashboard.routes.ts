import { Router } from 'express'
import { getDashboardStatistics } from '../controllers/dashboard.controller.js'

export const dashboardRouter = Router()
dashboardRouter.get('/stats', getDashboardStatistics)
