import { NextRequest, NextResponse } from 'next/server'

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const
const TOKEN_TTL = 7 * 24 * 60 * 60 * 1000
const COOKIE = 'ata-admin'

async function verify(token: string): Promise<boolean> {
  try {
    const secret = process.env.ADMIN_SECRET || process.env.NEXTAUTH_SECRET || 'ata-admin-fallback-secret'
    const dot = token.indexOf('.')
    if (dot === -1) return false
    const ts = token.slice(0, dot)
    const hex = token.slice(dot + 1)
    if (Date.now() - parseInt(ts) > TOKEN_TTL) return false
    const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), ALGORITHM, false, ['verify'])
    const pairs = hex.match(/.{2}/g)
    if (!pairs) return false
    const sig = new Uint8Array(pairs.map(b => parseInt(b, 16)))
    return crypto.subtle.verify(ALGORITHM, k, sig, new TextEncoder().encode(ts))
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const testMode =
    process.env.ATA_INTEGRATION_MODE === 'test' &&
    process.env.VERCEL_ENV !== 'production'
  const legacyAdminEnabled =
    testMode && process.env.ATA_LEGACY_ADMIN_ENABLED === 'true'
  const customerAccountsEnabled =
    testMode && process.env.ATA_CUSTOMER_ACCOUNTS_ENABLED === 'true'

  if (
    !customerAccountsEnabled &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/api/user') ||
      pathname.startsWith('/api/auth/register') ||
      pathname.startsWith('/book') ||
      pathname.startsWith('/flights') ||
      pathname.startsWith('/packages') ||
      pathname.startsWith('/reviews') ||
      pathname.startsWith('/api/bookings') ||
      pathname.startsWith('/api/quotes') ||
      pathname.startsWith('/api/packages') ||
      pathname.startsWith('/api/reviews'))
  ) {
    return new NextResponse('Not found', { status: 404 })
  }

  if (
    !legacyAdminEnabled &&
    (pathname.startsWith('/admin') || pathname.startsWith('/api/admin'))
  ) {
    return new NextResponse('Not found', { status: 404 })
  }

  // Always allow login page and auth endpoint
  if (pathname === '/admin/login' || pathname.startsWith('/api/admin/auth')) {
    return NextResponse.next()
  }

  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi = pathname.startsWith('/api/admin')
  if (!isAdminPage && !isAdminApi) return NextResponse.next()

  const token = req.cookies.get(COOKIE)?.value
  const ok = token ? await verify(token) : false

  if (!ok) {
    if (isAdminApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL('/admin/login', req.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/user/:path*',
    '/api/auth/register',
    '/book/:path*',
    '/flights/:path*',
    '/packages/:path*',
    '/reviews/:path*',
    '/api/bookings/:path*',
    '/api/quotes/:path*',
    '/api/packages/:path*',
    '/api/reviews/:path*',
  ],
}
