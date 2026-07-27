import Link from 'next/link'
import { BRAND } from '@/lib/config'

/**
 * Customer-facing footer. Owner, admin and review routes are deliberately not
 * linked from here — see PublicNav for the same rule.
 */
export default function SiteFooter() {
  return (
    <footer className="bg-ata-ink px-6 pb-10 pt-20 text-white lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-14 border-b border-white/10 pb-16 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-serif text-[32px] font-light leading-none">
              Amanuel Travel Agency
            </p>
            <p className="mt-6 max-w-sm text-[15px] font-light leading-7 text-white/50">
              Eritrea travel arranged by people who know it personally. Every
              journey is planned in conversation, and confirmed only when it is
              genuinely arranged.
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
              Explore
            </p>
            <div className="mt-6 grid gap-4 text-[15px] font-light text-white/60">
              <Link href="/tours/flagship-preview" className="w-fit transition-colors hover:text-white">
                Asmara to Massawa
              </Link>
              <Link href="/#destinations" className="w-fit transition-colors hover:text-white">
                Destinations
              </Link>
              <Link href="/#how-it-works" className="w-fit transition-colors hover:text-white">
                How we work
              </Link>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
              Speak with ATA
            </p>
            <div className="mt-6 grid gap-4 text-[15px] font-light text-white/60">
              <a href={`mailto:${BRAND.email}`} className="w-fit transition-colors hover:text-white">
                {BRAND.email}
              </a>
              <a href={BRAND.whatsappLink} className="w-fit transition-colors hover:text-white">
                WhatsApp
              </a>
              <p className="leading-6">
                {BRAND.addressLine1}
                <br />
                {BRAND.city}
              </p>
            </div>
          </div>
        </div>

        <p className="pt-8 text-[12px] font-light text-white/30">
          © {new Date().getFullYear()} Amanuel Travel Agency. Sending a request
          does not book or confirm travel.
        </p>
      </div>
    </footer>
  )
}
