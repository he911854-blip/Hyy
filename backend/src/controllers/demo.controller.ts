import type { NextFunction, Request, Response } from 'express'
import { seedDemoData } from '../services/demo.service.js'

export async function seedDemo(request: Request, response: Response, next: NextFunction) {
  try { response.json({ success: true, data: await seedDemoData() }) } catch (error) { next(error) }
}
