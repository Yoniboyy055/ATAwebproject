// Thin Next.js integration file. Implementation lives in private-proof-ledger/.
import type { Metadata } from 'next'

import '../../private-proof-ledger/styles/proof-ledger.css'

export const metadata: Metadata = {
  title: 'Proof Ledger',
  // Never indexed, never previewed, and no balance information in metadata.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
}

export default function ProofLedgerLayout({ children }: { children: React.ReactNode }) {
  return <div className="proof-ledger-root">{children}</div>
}
