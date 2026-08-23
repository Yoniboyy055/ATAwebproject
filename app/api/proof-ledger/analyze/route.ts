// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { NextRequest } from 'next/server'

import { getLedgerRepository } from '../../../../private-proof-ledger/database/prisma-repository'
import { handleAnalyze } from '../../../../private-proof-ledger/server/handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  return handleAnalyze(request, getLedgerRepository())
}
