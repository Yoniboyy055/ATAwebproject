import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _reviewId = params.id // Stored for future database update

    // In production, increment helpfulCount in database
    return NextResponse.json({
      success: true,
      message: 'Review marked as helpful',
    })
  } catch (error) {
    console.error('Error marking review as helpful:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
