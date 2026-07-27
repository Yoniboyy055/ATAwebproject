/**
 * Preview-visibility control required by the WP-04V fixture manifest: every
 * WP-04V screen must state that it is not the published site. Kept deliberately
 * quiet so it reads as a status line rather than part of the brand.
 */
export default function PreviewBanner() {
  return (
    <div className="bg-ata-ink px-5 py-2 text-center text-[11px] font-light leading-5 tracking-[0.02em] text-white/60">
      Preview of the new Amanuel Travel site — prices, dates and itinerary
      details are still being confirmed with ATA.
    </div>
  )
}
