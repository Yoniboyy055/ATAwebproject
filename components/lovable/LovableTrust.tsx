import SectionHeader from '@/components/ui/SectionHeader'

export default function LovableTrust() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4">
        <SectionHeader
          title="Who we serve"
          subtitle="Local travelers and diaspora families who want a calm, guided booking experience."
          className="mb-12"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Local Outbound Travelers */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Local Travelers
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Local Travelers
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Eritrean residents traveling for work, study, or family visits. We
              coordinate flights, documentation, and logistics with clear guidance.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Visa and document checklists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Flight options with timing guidance</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Accommodation suggestions when needed</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Clear next steps for booking</span>
              </li>
            </ul>
          </div>

          {/* Diaspora Returns */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Diaspora Families
            </p>
            <h3 className="mt-3 text-xl font-semibold text-slate-900">
              Diaspora Returns
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              Eritreans abroad returning home for family reunions and heritage
              visits. We coordinate multi-city travel and arrival support.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Family reunions and group coordination</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Support for cultural and heritage travel</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Flexible routing for multi-city arrivals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
                <span>Ongoing support before and after travel</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
