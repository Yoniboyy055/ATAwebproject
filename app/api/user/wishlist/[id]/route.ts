import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _itemId = params.id // Stored for future use in delete logic

    // In production, delete from database
    return NextResponse.json({
      success: true,
      message: 'Item removed from wishlist',
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
