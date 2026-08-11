// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { NextRequest } from 'next/server'

import { getLedgerRepository } from '../../../../private-proof-ledger/database/prisma-repository'
import { handleCreateNote } from '../../../../private-proof-ledger/server/handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return handleCreateNote(request, getLedgerRepository())
}
