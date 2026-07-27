import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAtaFeatureFlags } from '@/lib/ata/feature-flags'
import {
  createAtaPreviewRepository,
  PREVIEW_PROVENANCE,
} from '@/lib/ata/preview-repository'
import PreviewBanner from '@/components/ata/PreviewBanner'

export const metadata = {
  title: 'Owner administration — Amanuel Travel Agency',
  robots: { index: false, follow: false },
}

/**
 * Only the entries with a section id are linked. The rest are part of the
 * intended structure but have no screen yet, so they are shown inactive rather
 * than as links that scroll nowhere.
 */
const nav: { label: string; id?: string }[] = [
  { label: 'Overview', id: 'overview' },
  { label: 'Tours', id: 'tours' },
  { label: 'Content' },
  { label: 'Pricing', id: 'pricing' },
  { label: 'Dates & availability', id: 'pricing' },
  { label: 'Customer requests', id: 'customer-requests' },
  { label: 'Quotes' },
  { label: 'Verification', id: 'verification' },
  { label: 'Approvals', id: 'verification' },
  { label: 'Publication' },
  { label: 'Media' },
  { label: 'Policies' },
  { label: 'Users & roles' },
  { label: 'Audit history', id: 'audit-history' },
  { label: 'Settings' },
]

const workflowLabels: Record<string, string> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under review',
  MORE_INFORMATION_REQUIRED: 'More information required',
  QUALIFIED: 'Qualified',
  QUOTE_PREPARATION: 'Quote preparation',
  QUOTE_SENT: 'Quote sent',
  CUSTOMER_RESPONSE_PENDING: 'Customer response pending',
  ACCEPTED_IN_PRINCIPLE: 'Accepted in principle',
  PAYMENT_PENDING: 'Payment pending',
  MANUALLY_CONFIRMED: 'Manually confirmed',
  DECLINED: 'Declined',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
  ARCHIVED: 'Archived',
}

const eyebrow =
  'text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass'
const panel = 'border border-ata-hairline bg-white'
const panelHeading =
  'mt-3 font-serif text-[28px] font-normal leading-tight text-ata-ink'

export default function AtaAdminPage() {
  if (!getAtaFeatureFlags().stagingAdmin) notFound()

  const repo = createAtaPreviewRepository()
  const summary = repo.getSummary()
  const metrics: [string, number][] = [
    ['Tours in draft', summary.draftTours],
    ['Missing prices', summary.missingPrices],
    ['Dates unpublished', summary.unpublishedDates],
    ['Awaiting evidence', summary.awaitingEvidence],
    ['Awaiting approval', summary.awaitingApproval],
    ['Approved, unreleased', summary.approvedUnreleased],
    ['Open requests', summary.customerRequests],
    ['Manually confirmed', summary.manuallyConfirmed],
  ]

  return (
    <main className="min-h-screen bg-ata-canvas text-ata-ink">
      <PreviewBanner />

      <div className="lg:grid lg:grid-cols-[268px_1fr]">
        {/* Sidebar */}
        <aside className="bg-ata-ink px-7 py-8 text-white lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-[22px] font-normal leading-none">
                Amanuel Travel
              </p>
              <p className="mt-2 text-[9px] font-medium uppercase tracking-eyebrow text-white/45">
                Owner administration
              </p>
            </div>
            <span className="border border-ata-brass-light/50 px-2.5 py-1 text-[9px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
              Preview
            </span>
          </div>

          <nav
            className="mt-10 grid grid-cols-2 gap-x-4 lg:grid-cols-1 lg:gap-x-0"
            aria-label="Owner administration"
          >
            {nav.map((item, i) =>
              item.id ? (
                <a
                  key={item.label}
                  href={`#${item.id}`}
                  className={`border-b border-white/[.07] py-3 text-[13px] font-light transition-colors ${
                    i === 0
                      ? 'text-ata-brass-light'
                      : 'text-white/65 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  key={item.label}
                  className="flex items-center justify-between gap-2 border-b border-white/[.07] py-3 text-[13px] font-light text-white/25"
                >
                  {item.label}
                  <span className="text-[8px] uppercase tracking-eyebrow">
                    Soon
                  </span>
                </span>
              )
            )}
          </nav>
        </aside>

        <div>
          {/* Header */}
          <header className="flex flex-wrap items-end justify-between gap-5 border-b border-ata-hairline bg-white px-7 py-7 lg:px-12">
            <div>
              <p className={eyebrow}>ATA owner · Business authority</p>
              <h1 className="mt-3 font-serif text-[36px] font-light leading-none text-ata-ink">
                Operations overview
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/ata-review"
                className="border border-ata-hairline px-6 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink transition-colors hover:border-ata-ink"
              >
                Review guide
              </Link>
              <Link
                href="/"
                className="border border-ata-ink bg-ata-ink px-6 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-white transition-colors hover:bg-transparent hover:text-ata-ink"
              >
                View website
              </Link>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] space-y-6 px-7 py-8 lg:px-12 lg:py-10">
            {/* Provenance notice */}
            <div className="border-l-2 border-ata-brass bg-white px-6 py-5">
              <p className="text-[15px] font-light leading-7 text-ata-ink-soft">
                <span className="font-medium text-ata-ink">
                  Demonstration workspace.
                </span>{' '}
                Every number and record on this page is preview data. Nothing
                here is published, and nothing is connected to Supabase.
              </p>
            </div>

            {/* Metrics */}
            <section id="overview">
              <div className="grid grid-cols-2 gap-px border border-ata-hairline bg-ata-hairline lg:grid-cols-4">
                {metrics.map(([label, value]) => (
                  <article key={label} className="bg-white px-6 py-7">
                    <p className="text-[11px] font-light leading-5 text-ata-ink-soft">
                      {label}
                    </p>
                    <p className="mt-4 font-serif text-[44px] font-light leading-none text-ata-ink">
                      {value}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Tours + editor */}
            <section id="tours" className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
              <div className={`${panel} p-7`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className={eyebrow}>Tour management</p>
                    <h2 className={panelHeading}>Working tours</h2>
                  </div>
                  <button className="border border-ata-ink px-6 py-3 text-[10px] font-medium uppercase tracking-eyebrow transition-colors hover:bg-ata-ink hover:text-white">
                    Create tour
                  </button>
                </div>

                <div className="mt-8 border-t border-ata-hairline">
                  {repo.getTours().map((t) => (
                    <article
                      key={t.id}
                      className="border-b border-ata-hairline py-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-[21px] font-normal text-ata-ink">
                            {t.title}
                          </h3>
                          <p className="mt-2 text-[13px] font-light text-ata-ink-soft">
                            {t.status} · {t.priceStatus} · {t.dateStatus}
                          </p>
                        </div>
                        <span className="border border-ata-hairline px-3 py-1.5 text-[11px] font-medium text-ata-ink-soft">
                          {t.readiness}% ready
                        </span>
                      </div>
                      <div className="mt-5 h-px w-full bg-ata-hairline">
                        <div
                          className="h-px bg-ata-brass"
                          style={{ width: `${t.readiness}%` }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="bg-ata-ink p-7 text-white">
                <p className="text-[10px] font-medium uppercase tracking-eyebrow text-ata-brass-light">
                  Tour editor · preview
                </p>
                <h2 className="mt-3 font-serif text-[28px] font-light leading-tight text-white">
                  Highlands to Red Sea
                </h2>
                <div className="mt-8 grid gap-px bg-white/10 sm:grid-cols-2">
                  {[
                    'Summary',
                    'Destination sections',
                    'Itinerary',
                    'Inclusions & exclusions',
                    'Accommodation',
                    'Transportation',
                    'Important information',
                    'Images & rights',
                  ].map((x, i) => (
                    <button
                      key={x}
                      className="flex items-center gap-3 bg-ata-ink px-4 py-3.5 text-left text-[13px] font-light transition-colors hover:text-ata-brass-light"
                    >
                      <span
                        className={
                          i < 3 ? 'text-ata-brass-light' : 'text-white/30'
                        }
                      >
                        {i < 3 ? '●' : '○'}
                      </span>
                      {x}
                    </button>
                  ))}
                </div>
                <button className="mt-8 w-full border border-ata-brass-light bg-ata-brass-light px-6 py-4 text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink transition-colors hover:bg-transparent hover:text-ata-brass-light">
                  Preview changes
                </button>
              </div>
            </section>

            {/* Pricing + dates */}
            <section id="pricing" className="grid gap-6 xl:grid-cols-2">
              <EditorCard
                title="Pricing and publication"
                eyebrowText="Controlled commercial information"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Pricing status" value="Not provided" />
                  <Field label="Price type" value="Contact ATA" />
                  <Field label="Currency" value="Not selected" />
                  <Field label="Public display" value="Price on request" />
                </div>
                <StateActions />
              </EditorCard>

              <EditorCard
                title="Dates and availability"
                eyebrowText="No invented capacity"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Departure" value="Not provided" />
                  <Field label="Return" value="Not provided" />
                  <Field
                    label="Availability"
                    value="Registration of interest open"
                  />
                  <Field label="Publication" value="Not published" />
                </div>
                <StateActions />
              </EditorCard>
            </section>

            {/* Control gates */}
            <section id="verification" className={`${panel} p-7`}>
              <p className={eyebrow}>Separate control gates</p>
              <h2 className={panelHeading}>
                Evidence → verification → ATA approval → release
              </h2>

              <div className="mt-8 grid gap-px border border-ata-hairline bg-ata-hairline md:grid-cols-5">
                {[
                  ['Draft created', 'Complete'],
                  ['Evidence attached', 'Missing'],
                  ['Fact verified', 'Pending'],
                  ['ATA business approval', 'Locked'],
                  ['Public release', 'Locked'],
                ].map(([step, state], i) => (
                  <div key={step} className="bg-white px-5 py-6">
                    <span className="font-serif text-[20px] font-light text-ata-brass-light">
                      0{i + 1}
                    </span>
                    <h3 className="mt-5 text-[14px] font-medium leading-6 text-ata-ink">
                      {step}
                    </h3>
                    <p className="mt-2 text-[12px] font-light text-ata-ink-soft">
                      {state}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-6 border-l-2 border-ata-brass bg-ata-canvas px-6 py-5 text-[15px] font-light leading-7 text-ata-ink-soft">
                <span className="font-medium text-ata-ink">
                  Approval never publishes automatically.
                </span>{' '}
                Release is a separate deliberate action, available only to ATA
                publication authority.
              </p>
            </section>

            {/* Requests + lifecycle */}
            <section
              id="customer-requests"
              className="grid gap-6 xl:grid-cols-[1fr_1.2fr]"
            >
              <div className={`${panel} p-7`}>
                <p className={eyebrow}>Customer requests</p>
                <h2 className={panelHeading}>Operations queue</h2>
                <div className="mt-8 border-t border-ata-hairline">
                  {repo.getRequests().map((r) => (
                    <article
                      key={r.id}
                      className="flex flex-wrap items-start justify-between gap-4 border-b border-ata-hairline py-5"
                    >
                      <div>
                        <p className="text-[15px] font-medium text-ata-ink">
                          {r.guest}
                        </p>
                        <p className="mt-1.5 text-[12px] font-light text-ata-ink-soft">
                          {r.id} · {r.owner}
                        </p>
                        <p className="mt-1 text-[12px] font-light text-ata-ink-muted">
                          Updated {r.updated}
                        </p>
                      </div>
                      <span className="border border-ata-hairline px-3 py-1.5 text-[11px] font-medium text-ata-ink-soft">
                        {workflowLabels[r.status]}
                      </span>
                    </article>
                  ))}
                </div>
              </div>

              <div className={`${panel} p-7`}>
                <p className={eyebrow}>Full request lifecycle</p>
                <h2 className={panelHeading}>Fifteen controlled states</h2>
                <div className="mt-8 flex flex-wrap gap-2">
                  {repo.getWorkflow().map((s, i) => (
                    <span
                      key={s}
                      className={`px-3 py-2 text-[11px] font-light ${
                        s === 'MANUALLY_CONFIRMED'
                          ? 'bg-ata-ink font-medium text-white'
                          : 'border border-ata-hairline text-ata-ink-soft'
                      }`}
                    >
                      {i + 1}. {workflowLabels[s]}
                    </span>
                  ))}
                </div>
                <p className="mt-7 border-l-2 border-ata-brass bg-ata-canvas px-6 py-5 text-[15px] font-light leading-7 text-ata-ink-soft">
                  <span className="font-medium text-ata-ink">
                    Confirmation restriction:
                  </span>{' '}
                  submitted, quote sent, accepted in principle and payment
                  pending are not confirmations. Only{' '}
                  <span className="font-medium text-ata-ink">
                    Manually confirmed
                  </span>{' '}
                  represents confirmation.
                </p>
              </div>
            </section>

            {/* Audit */}
            <section id="audit-history" className={`${panel} p-7`}>
              <p className={eyebrow}>Activity and audit history</p>
              <h2 className={panelHeading}>Who changed what, and why</h2>
              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-ata-hairline">
                      {[
                        'Actor',
                        'Action',
                        'Entity',
                        'Previous',
                        'New',
                        'Time',
                        'Environment',
                      ].map((x) => (
                        <th
                          key={x}
                          className="pb-4 pr-6 text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted"
                        >
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-ata-hairline text-[14px] font-light text-ata-ink-soft">
                      <td className="py-5 pr-6 font-medium text-ata-ink">
                        ATA Owner
                      </td>
                      <td className="pr-6">Approved wording</td>
                      <td className="pr-6">Tour summary</td>
                      <td className="pr-6">Under review</td>
                      <td className="pr-6">Approved, unreleased</td>
                      <td className="pr-6">Today 09:14</td>
                      <td>
                        <span className="border border-ata-hairline px-2.5 py-1 text-[11px]">
                          Preview
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <p className="pb-4 text-[12px] font-light text-ata-ink-muted">
              {PREVIEW_PROVENANCE}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

function EditorCard({
  title,
  eyebrowText,
  children,
}: {
  title: string
  eyebrowText: string
  children: React.ReactNode
}) {
  return (
    <article className={`${panel} p-7`}>
      <p className={eyebrow}>{eyebrowText}</p>
      <h2 className={`${panelHeading} mb-8`}>{title}</h2>
      {children}
    </article>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2.5 block text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted">
        {label}
      </span>
      <span className="block border border-ata-hairline bg-ata-canvas px-4 py-3.5 text-[15px] font-light text-ata-ink-soft">
        {value}
      </span>
    </label>
  )
}

function StateActions() {
  return (
    <div className="mt-8 flex flex-wrap gap-3 border-t border-ata-hairline pt-7">
      <button className="border border-ata-ink bg-ata-ink px-6 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-white transition-colors hover:bg-transparent hover:text-ata-ink">
        Save preview changes
      </button>
      <button
        disabled
        className="cursor-not-allowed border border-ata-hairline px-6 py-3 text-[10px] font-medium uppercase tracking-eyebrow text-ata-ink-muted"
      >
        Publish — approval required
      </button>
    </div>
  )
}
