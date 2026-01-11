import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock reviews data
const mockReviews = [
  {
    id: 'REV-001',
    packageId: 'PKG-001',
    packageName: 'Eritrea Discovery',
    rating: 5,
    title: 'Amazing cultural experience!',
    content: 'Had the time of my life. The guides were knowledgeable and the accommodations were excellent. Highly recommended!',
    authorName: 'John Smith',
    authorEmail: 'john@example.com',
    verified: true,
    helpfulCount: 12,
    createdAt: '2025-12-20',
  },
  {
    id: 'REV-002',
    packageId: 'PKG-002',
    packageName: 'Ethiopia Adventure',
    rating: 4,
    title: 'Great trek but challenging',
    content: 'The Ethiopian highlands are stunning. The trek was challenging but worth it. Would have appreciated more rest days.',
    authorName: 'Jane Doe',
    authorEmail: 'jane@example.com',
    verified: true,
    helpfulCount: 8,
    createdAt: '2025-12-15',
  },
  {
    id: 'REV-003',
    packageId: 'PKG-003',
    packageName: 'Diaspora Return Program',
    rating: 5,
    title: 'Life-changing journey home',
    content: 'This program helped me reconnect with my roots. Amanuel Travel made the entire process smooth and meaningful.',
    authorName: 'Ahmed Hassan',
    authorEmail: 'ahmed@example.com',
    verified: true,
    helpfulCount: 15,
    createdAt: '2025-12-10',
  },
]

export async function GET(request: NextRequest) {
  try {
    const packageId = request.nextUrl.searchParams.get('packageId')
    let filteredReviews = mockReviews

    if (packageId) {
      filteredReviews = mockReviews.filter((r) => r.packageId === packageId)
    }

    // Sort by helpful count (most helpful first)
    filteredReviews.sort((a, b) => b.helpfulCount - a.helpfulCount)

    return NextResponse.json({
      reviews: filteredReviews,
      total: filteredReviews.length,
      averageRating:
        filteredReviews.length > 0
          ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
          : 0,
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // In production, save to database
    const newReview = {
      id: `REV-${Date.now()}`,
      ...data,
      verified: false, // Admin verification required
      helpfulCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    }

    return NextResponse.json({
      success: true,
      review: newReview,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
