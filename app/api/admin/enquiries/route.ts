import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ enquiries })
  } catch (err) {
    console.error('[admin/enquiries] GET error:', err)
    return NextResponse.json({ enquiries: [], error: 'DB unavailable' }, { status: 200 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json()
    if (!id || !['new', 'read', 'replied'].includes(status)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json({ ok: true, enquiry: updated })
  } catch (err) {
    console.error('[admin/enquiries] PATCH error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
