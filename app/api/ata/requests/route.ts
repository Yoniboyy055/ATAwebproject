import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { CustomerRequestInputSchema } from '@/lib/ata/domain'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'
import { submitTestRequest } from '@/lib/ata/test-request-service'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const flags = getAtaFeatureFlags()
  if (!flags.flagshipPreview || !flags.testRequestService) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const input = CustomerRequestInputSchema.parse(await request.json())
    const receipt = await submitTestRequest(input)
    return NextResponse.json(receipt, { status: 202 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', fields: error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'The test request could not be accepted.' },
      { status: 400 }
    )
  }
}

