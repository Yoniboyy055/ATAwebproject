import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  services: {
    database: {
      status: 'up' | 'down'
      latency?: number
    }
    api: {
      status: 'up' | 'down'
    }
  }
}

const startTime = Date.now()

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const timestamp = new Date().toISOString()
  const uptime = Date.now() - startTime

  let databaseStatus: 'up' | 'down' = 'down'
  let databaseLatency: number | undefined

  // Check database connection
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    databaseLatency = Date.now() - start
    databaseStatus = 'up'
  } catch (error) {
    console.error('Database health check failed:', error)
    databaseStatus = 'down'
  }

  const response: HealthCheckResponse = {
    status: databaseStatus === 'up' ? 'healthy' : 'degraded',
    timestamp,
    uptime,
    services: {
      database: {
        status: databaseStatus,
        latency: databaseLatency,
      },
      api: {
        status: 'up',
      },
    },
  }

  return NextResponse.json(response, {
    status: databaseStatus === 'up' ? 200 : 503,
  })
}
