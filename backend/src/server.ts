import { app } from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.port, () => {
  console.log(`GeekFlow API 正在运行：http://localhost:${env.port}`)
})

function shutdown(signal: string) {
  console.log(`收到 ${signal}，正在关闭服务`)
  server.close(() => process.exit(0))
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
