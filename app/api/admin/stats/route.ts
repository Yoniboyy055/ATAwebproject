import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock data - used when Prisma is unavailable
const mockStats = {
  totalBookings: 127,
  pendingBookings: 8,
  totalRevenue: 45230,
  totalUsers: 342,
  completedBookings: 119,
  cancelledBookings: 5,
}

const getStats = async () => {
  if (!prisma) return null

  const [
    totalBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    totalUsers,
    totalRevenueResult,
  ] = await prisma.$transaction([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'pending' } }),
    prisma.booking.count({ where: { status: 'completed' } }),
    prisma.booking.count({ where: { status: 'cancelled' } }),
    prisma.user.count(),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'completed' },
    }),
  ])

  return {
    totalBookings,
    pendingBookings,
    completedBookings,
    cancelledBookings,
    totalUsers,
    totalRevenue: totalRevenueResult._sum.amount ?? 0,
  }
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, validate admin role
    // const adminEmails = ['admin@amanueltravel.com', 'staff@amanueltravel.com']
    // if (!adminEmails.includes(session.user?.email || '')) {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    // }

    const stats = (await getStats()) ?? mockStats

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
