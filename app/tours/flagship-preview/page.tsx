import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import FlagshipRequestForm from '@/components/ata/FlagshipRequestForm'
import PreviewBanner from '@/components/ata/PreviewBanner'
import PublicNav from '@/components/ata/PublicNav'
import SiteFooter from '@/components/ata/SiteFooter'
import { FLAGSHIP_PREVIEW_COPY } from '@/lib/ata/content-contract'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'

export const metadata = {
  title: 'Asmara to Massawa — Amanuel Travel Agency',
  robots: { index: false, follow: false },
}

/**
 * `image: null` is deliberate, not missing work: ATA has no photography of the
 * escarpment road, and no other destination shot honestly depicts it.
 */
const chapters: {
  n: string
  title: string
  place: string
  image: string | null
  body: string
}[] = [
  {
    n: '01',
    title: 'Arriving in Asmara',
    place: 'The highlands',
    image: '/images/dest-asmara-800.webp',
    body: 'You land a mile above the sea, where the air is thin and cool and the avenues are lined with palms. The first day is deliberately unhurried: settle in, walk, drink coffee, and let the altitude stop being a surprise.',
  },
  {
    n: '02',
    title: 'The city on foot',
    place: 'Asmara',
    image: '/images/hero.jpg',
    body: 'Asmara is a walking city. Cinemas, cafés and facades from another century sit along streets that people actually use. We shape these days around what interests you rather than a fixed list of stops.',
  },
  {
    n: '03',
    title: 'Down the escarpment',
    place: 'Highlands to coast',
    image: null,
    body: 'The road drops thousands of feet in a few hours. Cloud and terraced hillsides give way to scrub, then to heat and the first sight of the sea. It is the part of the journey people remember most.',
  },
  {
    n: '04',
    title: 'The coast at Massawa',
    place: 'Red Sea',
    image: '/images/dest-massawa.jpg',
    body: 'Coral-stone buildings, working harbours and the particular light of the Red Sea. How long you stay, and what you do here, is something we settle with you rather than in advance.',
  },
]

const arranged = [
  ['Routing and pacing', 'How many days, in what order, and how hard you want to travel.'],
  ['Where you stay', 'Chosen with you once we know your dates and your group.'],
  ['Getting around', 'Vehicles and drivers arranged for your party specifically.'],
  ['Guiding', 'Who accompanies you, and for which parts of the journey.'],
]

const faqs = [
  [
    'Are dates and availability shown on this page?',
    'No. Travel dates are confirmed personally by ATA once we know what you are planning. We would rather tell you what is genuinely possible than publish a calendar we cannot honour.',
  ],
  [
    'Is the itinerary above fixed?',
    'No. It describes the shape of the journey. The detail — timings, stops, how long in each place — is arranged with you.',
  ],
  [
    'Does sending the form book my trip?',
    'No. It starts a conversation with a person at ATA. Nothing is reserved and no payment is taken through this website.',
  ],
  [
    'When is my journey actually confirmed?',
    'Only when someone at ATA confirms it to you directly. A quote, or an agreement in principle, is not a confirmation.',
  ],
]

export default function FlagshipPreviewPage() {
  if (!getAtaFeatureFlags().flagshipPreview) notFound()

  return (
    <main className="bg-white text-ata-ink">
      <PreviewBanner />
      <PublicNav />

      {/* Hero */}
      <section className="relative isolate min-h-[600px] overflow-hidden bg-ata-ink text-white lg:min-h-[78vh]">
        <Image
          src="/images/dest-asmara-1200.webp"
          alt="Asmara seen across its rooftops"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ata-ink/45" />
        <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(11,22,31,.92)_0%,rgba(11,22,31,.78)_34%,rgba(11,22,31,.4)_66%,rgba(11,22,31,.26)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent_0%,rgba(11,22,31,.75)_100%)]" />
        <div className="relative mx-auto flex min-h-[600px] max-w-[1440px] flex-col justify-end px-6 pb-20 pt-32 lg:min-h-[78vh] lg:px-12 lg:pb-24">
          <div className="flex items-center gap-5">
            <span className="h-px w-14 bg-ata-brass-light" />
            <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
              The signature journey
            </span>
          </div>
          <h1 className="mt-8 font-serif text-[64px] font-light leading-[0.92] tracking-display text-white drop-shadow-[0_2px_24px_rgba(8,16,24,.6)] sm:text-[88px] lg:text-[112px]">
            Asmara to
            <br />
            <em className="font-normal italic text-ata-brass-light">Massawa</em>
          </h1>
          <p className="mt-8 max-w-lg text-[17px] font-light leading-8 text-white/70">
            A mile-high capital, an escarpment road, and the Red Sea at the end
            of it.
          </p>
        </div>
      </section>

      {/* Section nav */}
      <div className="sticky top-0 z-30 hidden border-b border-ata-hairline bg-white/95 backdrop-blur lg:block">
        <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-12 py-5 text-[11px] font-medium uppercase tracking-eyebrow">
          <a href="#overview" className="text-ata-brass">Overview</a>
          <a href="#itinerary" className="transition-opacity hover:opacity-60">The journey</a>
          <a href="#arranged" className="transition-opacity hover:opacity-60">What we arrange</a>
          <a href="#questions" className="transition-opacity hover:opacity-60">Questions</a>
          <a
            href="#request"
            className="ml-auto border border-ata-ink px-7 py-3 transition-colors hover:bg-ata-ink hover:text-white"
          >
            Start planning
          </a>
        </div>
      </div>

      {/* Overview + booking panel */}
      <section id="overview" className="px-6 py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[1.2fr_400px] lg:gap-24">
          <div>
            <h2 className="max-w-[20ch] font-serif text-[40px] font-light leading-[1.08] tracking-display text-ata-ink sm:text-[52px]">
              One road, and most of Eritrea along it
            </h2>
            <p className="mt-8 max-w-2xl text-[18px] font-light leading-9 text-ata-ink-soft">
              Few countries change this completely in a single day of travel.
              You begin among modernist cafés at two thousand metres and end at
              a coral-stone harbour on the Red Sea. We have made this journey
              many times, and we plan it differently for every group.
            </p>

            <div className="mt-14 grid gap-10 border-t border-ata-hairline pt-12 sm:grid-cols-3">
              {[
                ['Asmara', 'Cool highland air, long walks, unhurried days.'],
                ['The descent', 'Terraces, cloud, and the road down to the heat.'],
                ['Massawa', 'Coral stone, working harbours, Red Sea light.'],
              ].map(([title, body], i) => (
                <div key={title}>
                  <span className="font-serif text-[26px] font-light text-ata-brass-light">
                    0{i + 1}
                  </span>
                  <h3 className="mt-5 font-serif text-[26px] font-normal text-ata-ink">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] font-light leading-7 text-ata-ink-soft">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit border border-ata-hairline bg-ata-canvas lg:sticky lg:top-28">
            <div className="border-b border-ata-hairline px-8 py-7">
              <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                Plan this journey
              </p>
              <h2 className="mt-3 font-serif text-[30px] font-light leading-tight text-ata-ink">
                Speak with ATA
              </h2>
            </div>
            <div className="space-y-7 px-8 py-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted">
                  Price
                </p>
                <p className="mt-2 font-serif text-[28px] font-light text-ata-ink">
                  {FLAGSHIP_PREVIEW_COPY.pricePlaceholder}
                </p>
                <p className="mt-3 text-[14px] font-light leading-7 text-ata-ink-soft">
                  {FLAGSHIP_PREVIEW_COPY.priceDetail}
                </p>
              </div>
              <div className="border-t border-ata-hairline pt-7">
                <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted">
                  Travel dates
                </p>
                <p className="mt-2 font-serif text-[22px] font-light leading-snug text-ata-ink">
                  {FLAGSHIP_PREVIEW_COPY.datePlaceholder}
                </p>
                <p className="mt-3 text-[14px] font-light leading-7 text-ata-ink-soft">
                  {FLAGSHIP_PREVIEW_COPY.dateDetail}
                </p>
              </div>
              <a
                href="#request"
                className="block border border-ata-ink bg-ata-ink px-6 py-4 text-center text-[11px] font-medium uppercase tracking-eyebrow text-white transition-colors hover:bg-transparent hover:text-ata-ink"
              >
                Request a conversation
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* Itinerary */}
      <section id="itinerary" className="bg-ata-canvas px-6 py-24 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-[1200px]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                The journey
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[44px] font-light leading-[1.04] tracking-display text-ata-ink sm:text-[56px]">
              Highlands to coast, chapter by chapter
            </h2>
            <p className="mt-6 text-[16px] font-light leading-8 text-ata-ink-soft">
              An outline of how the journey unfolds. The exact shape of each day
              is arranged with you.
            </p>
          </div>

          <div className="mt-16 border-t border-ata-hairline">
            {chapters.map((c) => (
              <article
                key={c.n}
                className="grid items-center gap-8 border-b border-ata-hairline py-12 lg:grid-cols-[64px_1fr_320px]"
              >
                <span className="font-serif text-[34px] font-light leading-none text-ata-brass-light">
                  {c.n}
                </span>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted">
                    {c.place}
                  </p>
                  <h3 className="mt-4 font-serif text-[32px] font-normal leading-tight text-ata-ink">
                    {c.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-[16px] font-light leading-8 text-ata-ink-soft">
                    {c.body}
                  </p>
                </div>
                {c.image ? (
                  <div className="relative min-h-[220px] overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.place}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="hidden lg:block" aria-hidden />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* What we arrange */}
      <section id="arranged" className="px-6 py-24 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                What we arrange
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[44px] font-light leading-[1.04] tracking-display text-ata-ink sm:text-[52px]">
              Settled with you, not decided for you
            </h2>
            <p className="mt-7 max-w-sm text-[16px] font-light leading-8 text-ata-ink-soft">
              We do not publish a fixed package. These are the parts of the
              journey we put together once we understand your trip.
            </p>
          </div>

          <div className="border-t border-ata-hairline">
            {arranged.map(([title, body]) => (
              <div key={title} className="border-b border-ata-hairline py-8">
                <h3 className="font-serif text-[26px] font-normal text-ata-ink">
                  {title}
                </h3>
                <p className="mt-3 max-w-xl text-[16px] font-light leading-8 text-ata-ink-soft">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Questions */}
      <section id="questions" className="bg-ata-canvas px-6 py-24 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                Good to know
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[44px] font-light leading-[1.04] tracking-display text-ata-ink sm:text-[52px]">
              Straight answers
            </h2>
          </div>

          <div className="border-t border-ata-hairline">
            {faqs.map(([q, a]) => (
              <details key={q} className="group border-b border-ata-hairline py-7">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-[24px] font-normal text-ata-ink">
                  {q}
                  <ChevronDown
                    size={20}
                    className="shrink-0 text-ata-ink-muted transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className="mt-5 max-w-2xl text-[16px] font-light leading-8 text-ata-ink-soft">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Request */}
      <section id="request" className="px-6 py-24 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1200px] gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24">
          <div className="lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                Start here
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[44px] font-light leading-[1.02] tracking-display text-ata-ink sm:text-[54px]">
              Tell us what you are planning
            </h2>
            <p className="mt-7 max-w-sm text-[16px] font-light leading-8 text-ata-ink-soft">
              Even rough plans are enough to begin. A person at ATA will read
              this and reply to you directly.
            </p>
            <div className="mt-10 border-l-2 border-ata-brass-light bg-ata-canvas px-7 py-6">
              <p className="font-serif text-[20px] font-normal text-ata-ink">
                Not sure of your dates yet?
              </p>
              <p className="mt-3 text-[15px] font-light leading-7 text-ata-ink-soft">
                Tell us roughly when you would like to travel and we will work
                from there.
              </p>
            </div>
          </div>

          <div className="border border-ata-hairline bg-white p-8 sm:p-12">
            <FlagshipRequestForm />
          </div>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ata-hairline bg-white/95 p-3 backdrop-blur lg:hidden">
        <a
          href="#request"
          className="block bg-ata-ink px-6 py-4 text-center text-[11px] font-medium uppercase tracking-eyebrow text-white"
        >
          Start planning
        </a>
      </div>

      <div className="pb-20 lg:pb-0">
        <SiteFooter />
      </div>
    </main>
  )
}
