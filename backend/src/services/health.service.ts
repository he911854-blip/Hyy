import { prisma } from '../config/prisma.js'

export async function getHealthStatus() {
  await prisma.$queryRaw`SELECT 1`
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
  }
}

