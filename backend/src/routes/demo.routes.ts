import { Router } from 'express'
import { seedDemo } from '../controllers/demo.controller.js'

export const demoRouter = Router()
demoRouter.post('/seed', seedDemo)
