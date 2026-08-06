import { Router } from 'express'
import { deleteTask, getProjectTasks, getTask, getTasks, postProjectTask, putTask } from '../controllers/task.controller.js'

export const taskRouter = Router()
export const projectTaskRouter = Router({ mergeParams: true })

taskRouter.get('/', getTasks)
taskRouter.route('/:id').get(getTask).put(putTask).delete(deleteTask)
projectTaskRouter.route('/').get(getProjectTasks).post(postProjectTask)
