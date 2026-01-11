import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock wishlist data
const mockWishlists: {
  [key: string]: Array<{
    id: string
    packageId: string
    packageName: string
    destination: string
    price: number
    addedAt: string
  }>
} = {
  'user-1': [
    {
      id: 'WL-001',
      packageId: 'PKG-001',
      packageName: 'Eritrea Discovery',
      destination: 'Eritrea',
      price: 2500,
      addedAt: '2026-01-08',
    },
    {
      id: 'WL-002',
      packageId: 'PKG-003',
      packageName: 'Diaspora Return Program',
      destination: 'Horn of Africa',
      price: 4500,
      addedAt: '2026-01-06',
    },
  ],
}

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, fetch from database based on user ID
    const userWishlist = mockWishlists['user-1'] || []

    return NextResponse.json({
      wishlist: userWishlist,
      total: userWishlist.length,
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
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
    const newItem = {
      id: `WL-${Date.now()}`,
      ...data,
      addedAt: new Date().toISOString().split('T')[0],
    }

    return NextResponse.json({
      success: true,
      item: newItem,
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
