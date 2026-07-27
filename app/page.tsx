import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import PreviewBanner from '@/components/ata/PreviewBanner'
import PublicNav from '@/components/ata/PublicNav'
import SiteFooter from '@/components/ata/SiteFooter'

export const metadata: Metadata = {
  title: 'Amanuel Travel Agency — Eritrea, travelled well',
  description:
    'Eritrea journeys arranged personally by Amanuel Travel Agency, from the highlands of Asmara to the Red Sea coast.',
  robots: { index: false, follow: false },
}

const destinations = [
  {
    name: 'Asmara',
    note: 'The highland capital',
    image: '/images/dest-asmara-1200.webp',
    span: 'lg:col-span-7',
    height: 'min-h-[520px]',
  },
  {
    name: 'Massawa',
    note: 'Red Sea port',
    image: '/images/dest-massawa.jpg',
    span: 'lg:col-span-5',
    height: 'min-h-[520px]',
  },
  {
    name: 'Dahlak',
    note: 'Coral stone and open sky',
    image: '/images/dest-dahlak-1200.webp',
    span: 'lg:col-span-5',
    height: 'min-h-[440px]',
  },
  {
    name: 'Keren',
    note: 'Market town in the hills',
    image: '/images/dest-keren-1200.webp',
    span: 'lg:col-span-7',
    height: 'min-h-[440px]',
  },
]

const process = [
  {
    n: '01',
    title: 'Tell us what you have in mind',
    body: 'Where you would like to go, roughly when, and who is travelling with you. Sending a request does not book anything.',
  },
  {
    n: '02',
    title: 'A person at ATA reads it',
    body: 'Not an automated system. We may come back with questions before we can say anything useful about your trip.',
  },
  {
    n: '03',
    title: 'We prepare your options',
    body: 'Routing, timing and costs put together for your group specifically. A quote is an offer, not a reservation.',
  },
  {
    n: '04',
    title: 'ATA confirms it with you',
    body: 'Your journey is arranged only when someone at ATA confirms it to you directly. Nothing about it is automatic.',
  },
]

export default function Home() {
  return (
    <main className="bg-white text-ata-ink">
      <PreviewBanner />

      {/* Hero */}
      <section className="relative isolate min-h-[760px] overflow-hidden bg-ata-ink text-white lg:min-h-[88vh]">
        <Image
          src="/images/dest-asmara-1200.webp"
          alt="Rooftops and palm-lined avenues of Asmara at low sun"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Two scrims: a flat tint to hold the whole frame down, then a
            left-weighted wedge so display type stays legible over a bright,
            high-detail photograph. */}
        <div className="absolute inset-0 bg-ata-ink/45" />
        <div className="absolute inset-0 bg-[linear-gradient(102deg,rgba(11,22,31,.94)_0%,rgba(11,22,31,.82)_32%,rgba(11,22,31,.42)_62%,rgba(11,22,31,.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent_0%,rgba(11,22,31,.75)_100%)]" />

        <PublicNav variant="overlay" />

        <div className="relative mx-auto flex min-h-[760px] max-w-[1440px] flex-col justify-end px-6 pb-20 pt-44 lg:min-h-[88vh] lg:px-12 lg:pb-28">
          <div className="max-w-2xl">
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass-light" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
                Eritrea · Arranged personally
              </span>
            </div>

            <h1 className="mt-9 font-serif text-[68px] font-light leading-[0.92] tracking-display text-white drop-shadow-[0_2px_24px_rgba(8,16,24,.6)] sm:text-[92px] lg:text-[116px]">
              The long way
              <br />
              <em className="font-normal italic text-ata-brass-light">home</em>
            </h1>

            <p className="mt-9 max-w-md text-[17px] font-light leading-8 text-white/80">
              From the highland streets of Asmara down to the Red Sea. Planned
              in conversation, at your pace, by people who know the road.
            </p>

            <div className="mt-11 flex flex-wrap gap-4">
              <Link
                href="/tours/flagship-preview"
                className="border border-ata-brass-light bg-ata-brass-light px-9 py-4 text-[11px] font-medium uppercase tracking-eyebrow text-ata-ink transition-colors hover:bg-transparent hover:text-ata-brass-light"
              >
                See the journey
              </Link>
              <Link
                href="#how-it-works"
                className="border border-white/40 px-9 py-4 text-[11px] font-medium uppercase tracking-eyebrow backdrop-blur-sm transition-colors hover:bg-white hover:text-ata-ink"
              >
                How we work
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="bg-ata-canvas px-6 py-28 lg:px-12 lg:py-40">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-24">
            <p className="font-serif text-[34px] font-light leading-[1.28] tracking-[-0.02em] text-ata-ink sm:text-[44px] lg:text-[52px]">
              Eritrea rewards travellers who arrive with someone who knows it.
              We are a small agency, and we plan each journey by hand.
            </p>
            <div className="grid gap-10 self-end">
              {[
                ['A conversation, not a booking engine', 'You speak with the same people from your first question to the day you fly.'],
                ['Nothing overstated', 'We tell you what is settled and what is not. If we do not know yet, we say so.'],
                ['Rooted in Asmara', 'Our office is in Eritrea. The knowledge is first-hand, not bought in.'],
              ].map(([title, body]) => (
                <div key={title} className="border-t border-ata-hairline pt-6">
                  <h3 className="font-serif text-[24px] font-normal leading-tight text-ata-ink">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] font-light leading-7 text-ata-ink-soft">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured journey */}
      <section className="px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-center gap-5">
            <span className="h-px w-14 bg-ata-brass" />
            <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
              The signature journey
            </span>
          </div>

          <div className="mt-12 grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <div className="relative min-h-[440px] overflow-hidden lg:min-h-[680px]">
              <Image
                src="/images/dest-massawa.jpg"
                alt="The Red Sea shoreline at Massawa"
                fill
                sizes="(max-width:1024px) 100vw, 58vw"
                className="object-cover transition-transform duration-[1200ms] hover:scale-[1.04]"
              />
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="font-serif text-[52px] font-light leading-[0.98] tracking-display text-ata-ink sm:text-[64px]">
                Asmara to
                <br />
                Massawa
              </h2>
              <p className="mt-7 max-w-md text-[17px] font-light leading-8 text-ata-ink-soft">
                One road carries you from a mile-high capital of cafés and
                modernist facades down an escarpment to the heat and coral
                stone of the Red Sea coast. It is the journey we know best.
              </p>

              <dl className="mt-12 border-t border-ata-hairline">
                {[
                  ['Route', 'Asmara → Massawa'],
                  ['Price', 'On request'],
                  ['Travel dates', 'Confirmed personally by ATA'],
                  ['Travelling', 'Private, guided by ATA'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-baseline justify-between gap-6 border-b border-ata-hairline py-5"
                  >
                    <dt className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted">
                      {label}
                    </dt>
                    <dd className="text-right font-serif text-[21px] font-normal text-ata-ink">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/tours/flagship-preview"
                className="mt-12 w-fit border border-ata-ink px-10 py-4 text-[11px] font-medium uppercase tracking-eyebrow transition-colors hover:bg-ata-ink hover:text-white"
              >
                Explore this journey
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section id="destinations" className="bg-ata-canvas px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto max-w-[1440px]">
          <div className="max-w-2xl">
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                Where we travel
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[46px] font-light leading-[1.02] tracking-display text-ata-ink sm:text-[58px]">
              Four places that shape the country
            </h2>
          </div>

          <div className="mt-16 grid gap-5 lg:grid-cols-12">
            {destinations.map((d) => (
              <article
                key={d.name}
                className={`group relative overflow-hidden bg-ata-ink ${d.span} ${d.height}`}
              >
                <Image
                  src={d.image}
                  alt={`${d.name}, Eritrea`}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,22,31,.05)_0%,rgba(11,22,31,.35)_48%,rgba(11,22,31,.88)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-white lg:p-10">
                  <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
                    {d.note}
                  </p>
                  <h3 className="mt-3 font-serif text-[40px] font-light leading-none text-white">
                    {d.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section id="how-it-works" className="px-6 py-28 lg:px-12 lg:py-36">
        <div className="mx-auto grid max-w-[1440px] gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div className="lg:sticky lg:top-16 lg:h-fit">
            <div className="flex items-center gap-5">
              <span className="h-px w-14 bg-ata-brass" />
              <span className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass">
                How we work
              </span>
            </div>
            <h2 className="mt-8 font-serif text-[46px] font-light leading-[1.02] tracking-display text-ata-ink sm:text-[56px]">
              Four steps, and a person at every one
            </h2>
            <p className="mt-7 max-w-sm text-[16px] font-light leading-8 text-ata-ink-soft">
              We would rather be slow and certain than quick and wrong. Here is
              exactly what happens after you write to us.
            </p>
          </div>

          <div className="border-t border-ata-hairline">
            {process.map((step) => (
              <article
                key={step.n}
                className="grid gap-6 border-b border-ata-hairline py-10 sm:grid-cols-[88px_1fr]"
              >
                <span className="font-serif text-[40px] font-light leading-none text-ata-brass-light">
                  {step.n}
                </span>
                <div>
                  <h3 className="font-serif text-[28px] font-normal leading-tight text-ata-ink">
                    {step.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-[16px] font-light leading-8 text-ata-ink-soft">
                    {step.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="relative isolate overflow-hidden bg-ata-ink px-6 py-32 text-white lg:px-12 lg:py-44">
        <Image
          src="/images/dest-keren-1200.webp"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ata-ink/85" />
        <div className="relative mx-auto max-w-[1440px] text-center">
          <h2 className="mx-auto max-w-[18ch] font-serif text-[46px] font-light leading-[1.05] tracking-display text-white sm:text-[64px]">
            Tell us where you would like to go.
          </h2>
          <p className="mx-auto mt-8 max-w-md text-[16px] font-light leading-8 text-white/60">
            One message is enough to start. There is no obligation, and nothing
            is booked until ATA confirms it with you.
          </p>
          <Link
            href="/tours/flagship-preview#request"
            className="mt-12 inline-block border border-ata-brass-light bg-ata-brass-light px-12 py-[18px] text-[11px] font-medium uppercase tracking-eyebrow text-ata-ink transition-colors hover:bg-transparent hover:text-ata-brass-light"
          >
            Start the conversation
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
