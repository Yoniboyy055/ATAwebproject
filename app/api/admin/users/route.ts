import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('search')

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          _count: { select: { bookings: true } },
        },
      }),
      prisma.user.count(),
    ])

    const formatted = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      createdAt: u.createdAt,
      lastLogin: null,
      bookingsCount: u._count.bookings,
    }))

    return NextResponse.json({
      users: formatted,
      total,
      activeThisMonth: 0,
    })
  } catch (err) {
    console.error('[admin/users] GET error:', err)
    return NextResponse.json({ users: [], total: 0, activeThisMonth: 0 })
  }
}
