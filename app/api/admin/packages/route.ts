import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  try {
    const packages = await prisma.package.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ packages })
  } catch (err) {
    console.error('[admin/packages] GET error:', err)
    return NextResponse.json({ packages: [] })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { type, title, description, price, recommended, includes, note } = await req.json()
    if (!type || !title) return NextResponse.json({ error: 'type and title are required' }, { status: 400 })
    const pkg = await prisma.package.create({
      data: {
        type,
        title,
        description: description || null,
        price: price ? parseFloat(price) : null,
        recommended: recommended || false,
        includes: includes || [],
        note: note || null,
      },
    })
    return NextResponse.json({ success: true, package: pkg })
  } catch (err) {
    console.error('[admin/packages] POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
