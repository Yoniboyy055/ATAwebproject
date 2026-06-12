import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()
    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price ? parseFloat(data.price) : null }),
        ...(data.recommended !== undefined && { recommended: data.recommended }),
        ...(data.includes !== undefined && { includes: data.includes }),
        ...(data.note !== undefined && { note: data.note }),
      },
    })
    return NextResponse.json({ success: true, package: pkg })
  } catch (err) {
    console.error('[admin/packages/[id]] PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.package.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[admin/packages/[id]] DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
