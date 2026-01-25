import Image from 'next/image'
import Link from 'next/link'
import { PrimaryButton } from '@/components/ui/PrimaryButton'

export default function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-1200.webp" 
          alt="Eritrea and Ethiopia landscapes"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for readability - stronger on the left for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-900/20" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="max-w-2xl">
          {/* Trust Signal */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mb-6">
            <span className="text-emerald-400">★</span>
            <span className="text-white text-sm font-medium">Trusted by 50,000+ Travelers</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Travel Home to <br/>
            <span className="text-emerald-400">Eritrea & Ethiopia</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-xl">
            We are a human-led travel agency specializing in diaspora travel. 
            Get expert help with flights, visas, and complex family itineraries.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/packages">
              <PrimaryButton className="text-lg px-8 w-full sm:w-auto">
                View Packages
              </PrimaryButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
