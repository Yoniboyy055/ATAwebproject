import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ posts, total: posts.length })
  } catch (err) {
    console.error('[admin/blog] GET error:', err)
    return NextResponse.json({ posts: [], total: 0 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, excerpt, content, author, category, tags, readTime } = await request.json()
    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required' }, { status: 400 })
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const post = await prisma.blogPost.create({
      data: {
        slug,
        title,
        excerpt: excerpt || null,
        content,
        author: author || 'Amanuel Travel',
        category: category || 'General',
        tags: tags || [],
        readTime: readTime ? parseInt(readTime) : 5,
        published: false,
      },
    })

    return NextResponse.json({ success: true, post })
  } catch (err) {
    console.error('[admin/blog] POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
