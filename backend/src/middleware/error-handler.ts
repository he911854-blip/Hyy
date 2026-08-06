import type { ErrorRequestHandler } from 'express'
import { MulterError } from 'multer'

interface HttpError extends Error {
  statusCode?: number
}

export const errorHandler: ErrorRequestHandler = (error: HttpError, _request, response, _next) => {
  console.error(error)
  if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
    response.status(400).json({ success: false, message: '单个文件不能超过 10 MB' })
    return
  }
  response.status(error.statusCode ?? 500).json({ success: false, message: error.message || '服务器内部错误' })
}
