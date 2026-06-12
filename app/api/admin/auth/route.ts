import { NextRequest, NextResponse } from 'next/server'
import { generateAdminToken } from '@/lib/admin-auth'

const COOKIE = 'ata-admin'
const MAX_AGE = 7 * 24 * 60 * 60

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()
    const adminPassword = process.env.ADMIN_PASSWORD || 'ata-admin-2024'

    if (!password || password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const token = await generateAdminToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: MAX_AGE,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' })
  return res
}
