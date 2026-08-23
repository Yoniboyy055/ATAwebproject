// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { NextRequest } from 'next/server'

import { getLedgerRepository } from '../../../../../private-proof-ledger/database/prisma-repository'
import { handleGetEvidence } from '../../../../../private-proof-ledger/server/handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return handleGetEvidence(request, getLedgerRepository(), params.id)
}
