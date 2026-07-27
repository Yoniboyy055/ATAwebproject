import Link from 'next/link'
import PreviewBanner from '@/components/ata/PreviewBanner'

export const metadata = {
  title: 'Owner review guide — Amanuel Travel Agency',
  robots: { index: false, follow: false },
}

const links: { label: string; href: string; note: string }[] = [
  { label: 'Homepage', href: '/', note: 'The public experience' },
  { label: 'Flagship journey', href: '/tours/flagship-preview', note: 'Asmara to Massawa' },
  { label: 'Customer request flow', href: '/tours/flagship-preview#request', note: 'What a traveller sends' },
  { label: 'Owner overview', href: '/ata-admin', note: 'Operations dashboard' },
  { label: 'Tour editor', href: '/ata-admin#tours', note: 'Working tours' },
  { label: 'Pricing and dates', href: '/ata-admin#pricing', note: 'Commercial controls' },
  { label: 'Verification and release', href: '/ata-admin#verification', note: 'The control gates' },
  { label: 'Customer workflow', href: '/ata-admin#customer-requests', note: 'Requests and lifecycle' },
]

const controls = [
  'Tour wording and important information',
  'Prices, dates and availability',
  'Evidence review and business approval',
  'Separate public release',
  'Customer requests, quotes and manual confirmation',
  'User roles and activity history',
]

const questions = [
  'Does the public experience feel recognisably ATA?',
  'Can an owner see what needs attention without being told?',
  'Are the price and date placeholders clear to a customer?',
  'Is the difference between approval and release obvious?',
  'Is manual confirmation unmistakable?',
  'What information should ATA provide next?',
]

export default function ReviewPage() {
  return (
    <main className="min-h-screen bg-ata-canvas text-ata-ink">
      <PreviewBanner />

      <header className="bg-ata-ink px-6 py-24 text-white lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex items-center gap-5">
            <span className="h-px w-14 bg-ata-brass-light" />
            <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
              ATA owner review
            </span>
          </div>
          <h1 className="mt-9 max-w-[20ch] font-serif text-[52px] font-light leading-[1.02] tracking-display text-white sm:text-[68px]">
            The website and the operation, side by side
          </h1>
          <p className="mt-8 max-w-xl text-[17px] font-light leading-8 text-white/60">
            This review uses demonstration information. It does not publish
            content, take payment, confirm bookings, or change anything in
            ATA&rsquo;s live systems.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1100px] px-6 py-20 lg:px-12 lg:py-28">
        <section>
          <div className="flex items-center gap-5">
            <span className="h-px w-14 bg-ata-brass" />
            <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
              What to look at
            </span>
          </div>

          {/* Four columns keeps the eight entries filling the grid exactly, so
              no empty cell shows the divider colour through. */}
          <div className="mt-10 grid gap-px border border-ata-hairline bg-ata-hairline sm:grid-cols-2 lg:grid-cols-4">
            {links.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className="group bg-white px-7 py-8 transition-colors hover:bg-ata-shell focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ata-brass"
              >
                <span className="font-serif text-[18px] font-light text-ata-brass-light">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="mt-6 font-serif text-[24px] font-normal leading-tight text-ata-ink">
                  {link.label}
                </h2>
                <p className="mt-2 text-[14px] font-light text-ata-ink-soft">
                  {link.note}
                </p>
                <p className="mt-6 text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted transition-colors group-hover:text-ata-brass">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-px border border-ata-hairline bg-ata-hairline lg:grid-cols-2">
          <div className="bg-white px-8 py-10 lg:px-10">
            <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
              Under ATA control
            </p>
            <h2 className="mt-4 font-serif text-[30px] font-light leading-tight text-ata-ink">
              What ATA decides
            </h2>
            <ul className="mt-8 border-t border-ata-hairline">
              {controls.map((item) => (
                <li
                  key={item}
                  className="border-b border-ata-hairline py-4 text-[15px] font-light leading-7 text-ata-ink-soft"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white px-8 py-10 lg:px-10">
            <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
              For this review
            </p>
            <h2 className="mt-4 font-serif text-[30px] font-light leading-tight text-ata-ink">
              Questions to answer
            </h2>
            <ol className="mt-8 border-t border-ata-hairline">
              {questions.map((q, i) => (
                <li
                  key={q}
                  className="flex gap-4 border-b border-ata-hairline py-4 text-[15px] font-light leading-7 text-ata-ink-soft"
                >
                  <span className="font-serif text-[16px] text-ata-brass-light">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </main>
  )
}
