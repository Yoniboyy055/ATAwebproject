import DesignHomePage from '@/components/DesignHomePage'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Amanuel Travel Agency · Asmara, Eritrea — Connecting Eritrea to the World',
  description: 'Amanuel Travel Agency — premium travel support from Asmara, Eritrea. Air tickets, diaspora travel, group coordination, and human consultation. Real people, real office, no bots.',
  themeColor: '#0A1628',
  authors: [{ name: 'Amanuel Travel Agency', url: 'https://amanueltravel.com' }],
  openGraph: {
    type: 'website',
    title: 'Amanuel Travel Agency — Connecting Eritrea to the World',
    description: 'Premium travel support from Asmara. Air tickets, diaspora travel, consultations. Real people. Real office.',
    url: 'https://amanueltravel.com',
    siteName: 'Amanuel Travel Agency',
    images: [{ url: '/images/hero.jpg', width: 1500, height: 663, alt: 'Asmara boulevard · Amanuel Travel Agency' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amanuel Travel Agency — Connecting Eritrea to the World',
    description: 'Premium travel support from Asmara. Air tickets, diaspora travel, consultations. Real people. Real office.',
    images: ['/images/hero.jpg'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Amanuel Travel Agency',
  description: 'Premium travel support from Asmara, Eritrea — air tickets, diaspora travel, group coordination, and human consultation.',
  url: 'https://amanueltravel.com',
  telephone: '+291-1-180240',
  email: 'amanueltravel@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Warsay Street, House 189, Alpha Building',
    addressLocality: 'Asmara',
    addressCountry: 'ER',
  },
  sameAs: ['https://www.facebook.com/AmanuelTravelAgency'],
}

export default function Home() {
  return (
    <>
      <Script
        id="jsonld-travel-agency"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DesignHomePage />
    </>
  )
}
