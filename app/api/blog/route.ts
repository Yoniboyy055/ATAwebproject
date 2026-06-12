import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, slug: true, title: true, excerpt: true, author: true, category: true, tags: true, image: true, readTime: true, publishedAt: true, createdAt: true },
    })
    return NextResponse.json({ posts })
  } catch (err) {
    console.error('[api/blog] GET error:', err)
    return NextResponse.json({ posts: [] })
  }
}
