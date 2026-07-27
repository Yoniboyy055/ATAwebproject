'use client'
import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')
  const isAtaExperience =
    pathname.startsWith('/tours/flagship-preview') ||
    pathname.startsWith('/ata-admin') ||
    pathname.startsWith('/ata-review')

  if (isHome || isAdmin || isAtaExperience) {
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
