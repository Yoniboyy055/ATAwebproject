import SectionHeading from '../../components/SectionHeading'
import DestinationsGrid from '../../components/DestinationsGrid'
import { BLUR_MAP } from '../../lib/images'
import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'Destinations — Eritrea, Ethiopia & More',
  description: 'Explore destinations in Eritrea and Ethiopia — discover our curated itineraries and travel options.',
  keywords: ['destinations', 'Eritrea', 'Ethiopia', 'travel', 'cities'],
  openGraph: {
    title: 'Top Travel Destinations',
    description: 'Explore curated cities in Eritrea and Ethiopia with expert travel guides',
    url: `${baseUrl}/destinations`,
    type: 'website',
    images: [
      {
        url: '/images/dest-800.webp',
        width: 1200,
        height: 630,
        alt: 'Travel Destinations',
      }
    ]
  }
}

export default function Destinations(){
  return (
    <div>
      <section className="section">
        <div className="container">
          <h1 className="text-2xl font-semibold">Destinations</h1>
          <SectionHeading>Explore our cities</SectionHeading>
          <p className="text-slate-700 max-w-xl">Browse our focused list of cities across Eritrea and Ethiopia. Use filters and search to find the right city, then request a quote via WhatsApp.</p>
          <div className="mt-6">
            <DestinationsGrid blurMap={BLUR_MAP} />
          </div>
        </div>
      </section>
    </div>
  )
}
