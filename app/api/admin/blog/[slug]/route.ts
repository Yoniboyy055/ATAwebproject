import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _slug = params.slug

    // In production, update in database
    return NextResponse.json({
      success: true,
      post: {
        slug: params.slug,
        ...data,
      },
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _slug = params.slug

    // In production, delete from database
    return NextResponse.json({
      success: true,
      message: 'Post deleted',
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
