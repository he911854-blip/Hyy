import type { Request, Response, NextFunction } from 'express'
import { getHealthStatus } from '../services/health.service.js'

export async function healthCheck(_request: Request, response: Response, next: NextFunction) {
  try {
    const data = await getHealthStatus()
    response.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

