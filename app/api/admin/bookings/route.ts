import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get('status')
    const where = status && status !== 'all' ? { status } : {}
    const bookings = await prisma.bookingRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ bookings, total: bookings.length })
  } catch (err) {
    console.error('[admin/bookings] GET error:', err)
    return NextResponse.json({ bookings: [], total: 0 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    if (!id || !status) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
    const booking = await prisma.bookingRequest.update({ where: { id }, data: { status } })
    return NextResponse.json({ success: true, booking })
  } catch (err) {
    console.error('[admin/bookings] PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
