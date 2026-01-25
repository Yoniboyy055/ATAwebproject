import { BRAND } from '@/lib/config'
import SectionHeader from '@/components/ui/SectionHeader'
import { buttonClasses } from '@/components/ui/Button'

export default function LovableFinalCta() {
  return (
    <section className="bg-slate-900 py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center text-white">
          <SectionHeader
            title="Talk with a real agent in Asmara"
            subtitle="We will guide your flights, documents, and family coordination from start to finish."
            tone="light"
          />

          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={`https://wa.me/${BRAND.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses({
                variant: 'primary',
                size: 'lg',
                className: 'bg-white text-slate-900 hover:bg-white/90'
              })}
            >
              Talk to an Agent
            </a>
            <p className="text-sm text-white/70">
              Reach us by WhatsApp, phone, or email.
            </p>
          </div>

          <div className="mt-10 grid gap-6 text-sm text-white/80 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Phone
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {BRAND.phoneOffice}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Email
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {BRAND.email}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Location
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {BRAND.addressLine1}
              </p>
              <p className="text-sm text-white/70">{BRAND.city}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
