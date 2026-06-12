import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const [totalBookings, pendingBookings, totalUsers, totalEnquiries, newEnquiries] = await Promise.allSettled([
      prisma.bookingRequest.count(),
      prisma.bookingRequest.count({ where: { status: 'new' } }),
      prisma.user.count(),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'new' } }),
    ])

    return NextResponse.json({
      totalBookings: totalBookings.status === 'fulfilled' ? totalBookings.value : 0,
      pendingBookings: pendingBookings.status === 'fulfilled' ? pendingBookings.value : 0,
      totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : 0,
      totalEnquiries: totalEnquiries.status === 'fulfilled' ? totalEnquiries.value : 0,
      newEnquiries: newEnquiries.status === 'fulfilled' ? newEnquiries.value : 0,
      totalRevenue: 0,
    })
  } catch (err) {
    console.error('[admin/stats] error:', err)
    return NextResponse.json({
      totalBookings: 0,
      pendingBookings: 0,
      totalUsers: 0,
      totalEnquiries: 0,
      newEnquiries: 0,
      totalRevenue: 0,
    })
  }
}
