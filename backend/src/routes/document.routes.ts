import { Router } from 'express'
import { deleteDocument, getProjectDocuments, postProjectDocument } from '../controllers/document.controller.js'
import { upload } from '../config/upload.js'

export const documentRouter = Router()
export const projectDocumentRouter = Router({ mergeParams: true })

documentRouter.delete('/:id', deleteDocument)
projectDocumentRouter.route('/').get(getProjectDocuments).post(upload.single('file'), postProjectDocument)
