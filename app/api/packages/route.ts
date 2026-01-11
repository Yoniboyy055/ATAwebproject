import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Mock packages data
const mockPackages = [
  {
    id: 'PKG-001',
    name: 'Eritrea Discovery',
    destination: 'Eritrea',
    description: '7-day cultural immersion in Eritrea',
    price: 2500,
    duration: 7,
    published: true,
  },
  {
    id: 'PKG-002',
    name: 'Ethiopia Adventure',
    destination: 'Ethiopia',
    description: '10-day trek through Ethiopian highlands',
    price: 3200,
    duration: 10,
    published: true,
  },
  {
    id: 'PKG-003',
    name: 'Diaspora Return Program',
    destination: 'Horn of Africa',
    description: 'Complete heritage journey for diaspora',
    price: 4500,
    duration: 14,
    published: true,
  },
]

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      packages: mockPackages,
      total: mockPackages.length,
    })
  } catch (error) {
    console.error('Error fetching packages:', error)
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

    // In production, create package in database
    const newPackage = {
      id: `PKG-${Date.now()}`,
      ...data,
      published: false,
    }

    return NextResponse.json({
      success: true,
      package: newPackage,
    })
  } catch (error) {
    console.error('Error creating package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // In production, update in database
    return NextResponse.json({
      success: true,
      package: data,
    })
  } catch (error) {
    console.error('Error updating package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // In production, delete from database
    return NextResponse.json({
      success: true,
      message: 'Package deleted',
    })
  } catch (error) {
    console.error('Error deleting package:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
