import HeroSection from '../components/home/HeroSection'
import CategoryTiles from '../components/home/CategoryTiles'
import FeaturedDeals from '../components/home/FeaturedDeals'
import DestinationsMap from '../components/home/DestinationsMap'
import Testimonials from '../components/home/Testimonials'
import CTASection from '../components/home/CTASection'

export const metadata = {
  title: 'Amanuel Travel — Travel Home & Beyond',
  description: 'Fast flights, visa help, and trusted support for Eritrea/Ethiopia routes. WhatsApp-first service for diaspora & local travelers.'
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoryTiles />
      <FeaturedDeals />
      <DestinationsMap />
      <Testimonials />
      <CTASection />
    </main>
  )
}
