import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const [
      totalEnquiries, newEnquiries,
      totalBookingRequests, totalUsers,
      newsletterSignups, revenueResult, recentEnquiries
    ] = await Promise.allSettled([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: 'new' } }),
      prisma.bookingRequest.count(),
      prisma.user.count(),
      prisma.newsletter.count(),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
      prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, service: true, status: true, createdAt: true } }),
    ])

    const revenue = revenueResult.status === 'fulfilled' ? (revenueResult.value._sum.amount ?? 0) : 0
    const recent = recentEnquiries.status === 'fulfilled' ? recentEnquiries.value : []

    return NextResponse.json({
      totalEnquiries: totalEnquiries.status === 'fulfilled' ? totalEnquiries.value : 0,
      newEnquiries: newEnquiries.status === 'fulfilled' ? newEnquiries.value : 0,
      totalBookingRequests: totalBookingRequests.status === 'fulfilled' ? totalBookingRequests.value : 0,
      totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : 0,
      newsletterSignups: newsletterSignups.status === 'fulfilled' ? newsletterSignups.value : 0,
      revenue,
      recentEnquiries: recent,
    })
  } catch (err) {
    console.error('[admin/analytics] error:', err)
    return NextResponse.json({ totalEnquiries: 0, newEnquiries: 0, totalBookingRequests: 0, totalUsers: 0, newsletterSignups: 0, revenue: 0, recentEnquiries: [] })
  }
}
