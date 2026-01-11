import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

// Mock blog data
const mockBlogPosts = [
  {
    slug: 'diaspora-return-guide',
    title: 'Complete Guide to Diaspora Return Programs',
    excerpt: 'Everything you need to know about returning home as a member of the diaspora',
    author: 'Amanuel Travel',
    readTime: 14,
    published: true,
    createdAt: '2025-12-15',
    updatedAt: '2026-01-08',
  },
  {
    slug: 'budget-travel-eritrea-ethiopia',
    title: 'Budget Travel Guide: Eritrea & Ethiopia',
    excerpt: 'Explore the Horn of Africa without breaking the bank',
    author: 'Amanuel Travel',
    readTime: 11,
    published: true,
    createdAt: '2025-12-20',
    updatedAt: '2026-01-05',
  },
]

export async function GET() {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      posts: mockBlogPosts,
      total: mockBlogPosts.length,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = body

    // In production, save to database
    const newPost = {
      slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      ...data,
      published: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }

    return NextResponse.json({
      success: true,
      post: newPost,
    })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
