import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Legacy booking execution is intentionally unavailable in WP-02.
 * Test requests use /api/ata/requests and never confirm a booking.
 */
export async function POST() {
  return NextResponse.json({ error: 'Not found' }, { status: 404 })
}
