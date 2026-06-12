import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, email, service, details } = body

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !service?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        service: service.trim(),
        details: details?.trim() || null,
      },
    })

    return NextResponse.json({ ok: true, id: enquiry.id }, { status: 201 })
  } catch (err) {
    console.error('[enquiries] POST error:', err)
    return NextResponse.json({ error: 'Failed to save enquiry' }, { status: 500 })
  }
}
