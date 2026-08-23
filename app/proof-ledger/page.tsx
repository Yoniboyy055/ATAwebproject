// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import { renderProofLedgerPage } from '../../private-proof-ledger/server/pages'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProofLedgerPage() {
  return renderProofLedgerPage()
}
