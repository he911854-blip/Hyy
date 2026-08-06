import 'dotenv/config'

function getRequiredEnv(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback
  if (!value) throw new Error(`缺少环境变量：${name}`)
  return value
}

export const env = {
  port: Number(getRequiredEnv('PORT', '3000')),
  clientOrigins: getRequiredEnv('CLIENT_ORIGIN').split(',').map((origin) => origin.trim()).filter(Boolean),
}
