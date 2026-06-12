import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const status = request.nextUrl.searchParams.get('status')

    const where = status && status !== 'all' ? { status } : {}

    const payments = await prisma.payment.findMany({
      where,
      include: { user: true, booking: true },
      orderBy: { createdAt: 'desc' },
    })

    const completedCount = await prisma.payment.count({ where: { status: 'completed' } })

    const formatted = payments.map((p) => ({
      id: p.id,
      bookingId: p.bookingId,
      guestName: p.user?.name || p.user?.email || 'Unknown',
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      paymentMethod: p.paymentMethod,
      createdAt: p.createdAt,
    }))

    return NextResponse.json({
      payments: formatted,
      total: payments.length,
      completed: completedCount,
    })
  } catch (err) {
    console.error('[admin/payments] GET error:', err)
    return NextResponse.json({ payments: [], total: 0, completed: 0 })
  }
}
