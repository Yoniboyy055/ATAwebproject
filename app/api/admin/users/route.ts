import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Mock users data
const mockUsers = [
  {
    id: 'USR-001',
    name: 'John Smith',
    email: 'john@example.com',
    bookings: 2,
    joinedDate: '2025-06-15',
    lastLogin: '2026-01-11T10:30:00Z',
  },
  {
    id: 'USR-002',
    name: 'Jane Doe',
    email: 'jane@example.com',
    bookings: 1,
    joinedDate: '2025-08-20',
    lastLogin: '2026-01-05T14:15:00Z',
  },
  {
    id: 'USR-003',
    name: 'Ahmed Hassan',
    email: 'ahmed@example.com',
    bookings: 3,
    joinedDate: '2025-05-10',
    lastLogin: '2026-01-11T09:00:00Z',
  },
  {
    id: 'USR-004',
    name: 'Mary Johnson',
    email: 'mary@example.com',
    bookings: 1,
    joinedDate: '2025-12-01',
    lastLogin: '2026-01-02T16:45:00Z',
  },
  {
    id: 'USR-005',
    name: 'David Brown',
    email: 'david@example.com',
    bookings: 0,
    joinedDate: '2026-01-09',
    lastLogin: null,
  },
]

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const search = request.nextUrl.searchParams.get('search')
    let filteredUsers = mockUsers

    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = mockUsers.filter(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower)
      )
    }

    // Calculate active this month (last login within 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const activeThisMonth = filteredUsers.filter((u) => {
      if (!u.lastLogin) return false
      return new Date(u.lastLogin) > thirtyDaysAgo
    }).length

    return NextResponse.json({
      users: filteredUsers,
      total: mockUsers.length,
      activeThisMonth,
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
