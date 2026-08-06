import { randomUUID } from 'node:crypto'
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import multer from 'multer'

export const uploadDirectory = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'uploads'))
mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (_request, file, callback) => callback(null, `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`),
})

export const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })
