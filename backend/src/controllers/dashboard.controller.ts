import type { NextFunction, Request, Response } from 'express'
import { getDashboardStats } from '../services/dashboard.service.js'

export async function getDashboardStatistics(_request: Request, response: Response, next: NextFunction) {
  try { response.json({ success: true, data: await getDashboardStats() }) } catch (error) { next(error) }
}
