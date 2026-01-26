import Image from 'next/image'
import { BRAND } from '@/lib/config'
import { buttonClasses } from '@/components/ui/Button'

export default function LovableHero() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-900">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.svg"
          alt="Coastal travel destination"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/60" />
      </div>

      <div className="relative">
        <div className="container px-4 py-20 md:py-28">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Asmara-based travel agency
            </p>

            <h1 className="mt-4 text-hero font-semibold leading-tight md:text-hero-lg">
              Human-led travel planning for Eritrean and Ethiopian families.
            </h1>

            <p className="mt-4 text-base text-white/90 md:text-lg">
              Flights, visas, and family coordination handled by real agents so your
              journey feels calm, clear, and well supported.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi! I'm part of the diaspora and need help planning a family trip. Can you assist me?`}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses({ variant: 'primary', size: 'lg' })}
              >
                Talk to an Agent
              </a>
              <p className="text-sm text-white/70">
                Typical response time: 1–2 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
