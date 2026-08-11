// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { NextRequest } from 'next/server'

import {
  handleLogin,
  handleLogout,
} from '../../../../private-proof-ledger/server/handlers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return handleLogin(request)
}

export async function DELETE() {
  return handleLogout()
}
