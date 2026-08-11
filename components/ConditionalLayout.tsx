'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')
  // Proof Ledger is a private, self-contained application. It must never show
  // ATA navigation, branding or footer links.
  const isProofLedger = pathname.startsWith('/proof-ledger')

  if (isHome || isAdmin || isProofLedger) {
    return <>{children}</>
  }

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
