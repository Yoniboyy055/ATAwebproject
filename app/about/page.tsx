import Link from 'next/link'
import { BRAND } from '@/lib/config'
import { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'
import { generateOrganizationSchema } from '@/lib/schema'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

export const metadata: Metadata = {
  title: 'About Amanuel Travel — Diaspora & Local Travel Support',
  description: 'Learn about Amanuel Travel: Your trusted partner for diaspora and local travel connecting Eritrea with the world.',
  keywords: ['about', 'travel agency', 'diaspora', 'Eritrea', 'travel support'],
  openGraph: {
    title: 'About Amanuel Travel Agency',
    description: 'Your trusted travel partner for diaspora and local travel from Eritrea',
    url: `${baseUrl}/about`,
    type: 'website',
  }
}

export default function About() {
  const organizationSchema = generateOrganizationSchema()

  return (
    <>
      <StructuredData data={organizationSchema} />
    <main className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Amanuel Travel</h1>
          <p className="text-lg md:text-xl text-emerald-50 max-w-2xl mx-auto">
            Your trusted travel partner connecting diaspora to home since 1999
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Story</h2>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                Founded in 1999, Amanuel Travel Agency was built on a simple mission: to make travel arrangements seamless for Eritreans around the world&mdash;whether they&rsquo;re traveling home to reconnect with family or exploring new destinations.
              </p>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                What started as a small office in Asmara has grown into a trusted platform serving 50,000+ happy travelers across the diaspora and locally.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Today, we combine local expertise with global partnerships to deliver premium travel experiences&mdash;from flight bookings and visa assistance to curated packages and family reunion tours.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-400 to-blue-500 h-96 flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-8xl mb-4">🌍</div>
                <p className="text-xl font-bold">25+ Years of Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Our Mission & Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-xl bg-white border border-slate-200 p-8">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Professional</h3>
              <p className="text-slate-700">
                We maintain the highest standards of professionalism in every booking, every arrangement, and every interaction with our clients.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-8">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Personal Touch</h3>
              <p className="text-slate-700">
                Travel is personal. We understand your unique needs and treat every journey with care and attention to detail.
              </p>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 p-8">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trustworthy</h3>
              <p className="text-slate-700">
                Your trust is our most valuable asset. We&rsquo;re transparent, reliable, and committed to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">✈️ Flight Bookings</h3>
              <p className="text-slate-700 mb-4">
                Access to major airlines with competitive pricing. We handle everything from booking to boarding.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Best price guarantees</li>
                <li>✓ Flexible payment plans</li>
                <li>✓ 24/7 support</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">📋 Visa Assistance</h3>
              <p className="text-slate-700 mb-4">
                Expert guidance through visa applications for popular destinations worldwide.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Document preparation</li>
                <li>✓ Application support</li>
                <li>✓ Expedited processing</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">🏨 Hotels & Packages</h3>
              <p className="text-slate-700 mb-4">
                Curated travel packages from budget to luxury with vetted accommodations.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Custom itineraries</li>
                <li>✓ Group discounts</li>
                <li>✓ Local experiences</li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">👨‍👩‍👧‍👦 Family Reunions</h3>
              <p className="text-slate-700 mb-4">
                Specialized tours designed for diaspora families reconnecting with loved ones back home.
              </p>
              <ul className="space-y-2 text-slate-700">
                <li>✓ Multi-city itineraries</li>
                <li>✓ Group coordination</li>
                <li>✓ Cultural immersion</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team / Leadership */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Leadership
          </h2>
          <div className="max-w-2xl mx-auto rounded-2xl bg-white border border-slate-200 p-8 md:p-12 text-center">
            <div className="text-7xl mb-6">👔</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              {BRAND.addressLine2}
            </h3>
            <p className="text-slate-600 text-lg mb-6">
              Amanuel Travel Agency
            </p>
            <p className="text-slate-700 leading-relaxed">
              With decades of experience in the travel industry and a deep commitment to our Eritrean diaspora community, our leadership ensures every client receives world-class service and attention.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <p className="text-emerald-50">Years of Service</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
              <p className="text-emerald-50">Happy Travelers</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <p className="text-emerald-50">Destinations</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <p className="text-emerald-50">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Plan Your Journey?
          </h2>
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
            Contact us today and let&rsquo;s create your perfect travel experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg"
            >
              💬 WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white px-8 py-4 rounded-lg font-bold transition"
            >
              📧 Email Us
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  )
}
