import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        ...body,
        updatedAt: new Date(),
        ...(body.published ? { publishedAt: new Date() } : {}),
      },
    })
    return NextResponse.json({ success: true, post })
  } catch (err) {
    console.error('[admin/blog/[slug]] PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.blogPost.delete({ where: { slug: params.slug } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/blog/[slug]] DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
