import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock payments data
const mockPayments = [
  {
    id: 'PAY-001',
    bookingId: 'BK-001',
    guestName: 'John Smith',
    amount: 4500,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'Credit Card',
    createdAt: '2026-01-11T10:30:00Z',
  },
  {
    id: 'PAY-002',
    bookingId: 'BK-002',
    guestName: 'Jane Doe',
    amount: 3200,
    currency: 'USD',
    status: 'pending',
    paymentMethod: 'Bank Transfer',
    createdAt: '2026-01-10T14:15:00Z',
  },
  {
    id: 'PAY-003',
    bookingId: 'BK-003',
    guestName: 'Ahmed Hassan',
    amount: 6800,
    currency: 'USD',
    status: 'completed',
    paymentMethod: 'PayPal',
    createdAt: '2026-01-08T09:45:00Z',
  },
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const status = request.nextUrl.searchParams.get('status')
    let filteredPayments = mockPayments

    if (status && status !== 'all') {
      filteredPayments = mockPayments.filter((p) => p.status === status)
    }

    return NextResponse.json({
      payments: filteredPayments,
      total: mockPayments.length,
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
