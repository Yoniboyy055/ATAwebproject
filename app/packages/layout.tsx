import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Travel Packages — Local & Diaspora Options',
  description: 'Curated travel packages for local travelers and diaspora families. Book flights, tours, and visa assistance bundles.',
  keywords: ['travel packages', 'tour packages', 'flight packages', 'diaspora travel'],
  openGraph: {
    title: 'Travel Packages',
    description: 'Affordable, all-inclusive travel packages tailored for local and diaspora travelers',
    url: `${baseUrl}/packages`,
    type: 'website',
    images: [
      {
        url: '/images/hero-1200.webp',
        width: 1200,
        height: 630,
        alt: 'Travel Packages',
      }
    ]
  }
}

export default function PackagesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
