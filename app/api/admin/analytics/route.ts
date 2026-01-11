import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Mock analytics data
const mockAnalytics = {
  totalEvents: 12450,
  uniqueUsers: 2340,
  topPages: [
    { page: '/packages', views: 3420, avgTimeOnPage: 245 },
    { page: '/blog', views: 2810, avgTimeOnPage: 180 },
    { page: '/destinations', views: 2135, avgTimeOnPage: 165 },
    { page: '/contact', views: 1890, avgTimeOnPage: 120 },
    { page: '/', views: 1650, avgTimeOnPage: 95 },
  ],
  conversions: {
    bookings: 34,
    newsletterSignups: 128,
    chatEngagements: 456,
  },
  abtestResults: [
    {
      testName: 'Mobile Footer CTA',
      variantA: {
        name: 'Need Help Planning Your Trip?',
        conversions: 12,
        visitors: 420,
      },
      variantB: {
        name: 'Get Expert Travel Help',
        conversions: 18,
        visitors: 380,
      },
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const range = request.nextUrl.searchParams.get('range') || '7d'

    // In production, calculate based on date range
    // For now, return mock data
    return NextResponse.json({
      data: mockAnalytics,
      range,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
