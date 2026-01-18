import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const hasNextAuthUrl = !!process.env.NEXTAUTH_URL
    const hasNextAuthSecret = !!process.env.NEXTAUTH_SECRET
    const hasDatabaseUrl = !!process.env.DATABASE_URL
    const hasGoogleClientId = !!process.env.GOOGLE_CLIENT_ID
    const hasGoogleClientSecret = !!process.env.GOOGLE_CLIENT_SECRET

    let dbConnected = false
    if (hasDatabaseUrl && prisma) {
      try {
        await prisma.$queryRaw`SELECT 1`
        dbConnected = true
      } catch (error) {
        console.error('[AuthHealth] Database connectivity check failed:', error)
      }
    }

    const ok =
      hasNextAuthUrl &&
      hasNextAuthSecret &&
      (dbConnected || (hasGoogleClientId && hasGoogleClientSecret))

    return NextResponse.json({
      ok,
      hasNextAuthUrl,
      hasNextAuthSecret,
      hasDatabaseUrl,
      hasGoogleClientId,
      hasGoogleClientSecret,
      dbConnected,
    })
  } catch (error) {
    console.error('[AuthHealth] Failed to evaluate auth health:', error)
    return NextResponse.json({
      ok: false,
      hasNextAuthUrl: false,
      hasNextAuthSecret: false,
      hasDatabaseUrl: false,
      hasGoogleClientId: false,
      hasGoogleClientSecret: false,
      dbConnected: false,
    })
  }
}
