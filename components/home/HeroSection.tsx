import Image from 'next/image'
import { BRAND } from '@/lib/config'

export default function HeroSection() {
  return (
    <section className="relative h-[50vh] md:h-[60vh] flex items-center text-white overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/hero.svg"
          alt="Hero"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Travel Home & Beyond
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/95">
            Fast flights, visa help, and trusted support for Eritrea/Ethiopia routes. WhatsApp-first service for diaspora & local travelers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              className="inline-flex items-center justify-center rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 font-semibold transition"
            >
              💬 Get a Quote
            </a>
            <a
              href="#destinations"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 hover:border-white text-white px-6 py-3 font-semibold transition"
            >
              Explore Destinations
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
