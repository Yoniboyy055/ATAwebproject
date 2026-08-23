// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { renderStatementPage } from '../../../private-proof-ledger/server/pages'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProofLedgerStatementPage() {
  return renderStatementPage()
}
