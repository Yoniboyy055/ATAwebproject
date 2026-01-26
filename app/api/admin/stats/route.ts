import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { isAdmin } from '@/lib/admin'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock data - in production, fetch from Prisma
const mockStats = {
  totalBookings: 127,
  pendingBookings: 8,
  totalRevenue: 45230,
  totalUsers: 342,
  completedBookings: 119,
  cancelledBookings: 5,
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!isAdmin(session.user.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({
      stats: {
        totalBookings: mockStats.totalBookings,
        pendingBookings: mockStats.pendingBookings,
        totalRevenue: mockStats.totalRevenue,
        totalUsers: mockStats.totalUsers,
        completedBookings: mockStats.completedBookings,
        cancelledBookings: mockStats.cancelledBookings,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
