import Section from '../../components/Section'
import SectionHeading from '../../components/SectionHeading'
import { BRAND } from '../../lib/config'

export const metadata = {
  title: 'Copyright — Amanuel Travel',
  description: 'Copyright and content ownership information.'
}

export default function Copyright() {
  return (
    <div>
      {/* Header */}
      <Section className="bg-gradient-to-b from-blue-50 to-white">
        <div className="container">
          <SectionHeading>Copyright & Attribution</SectionHeading>
          <p className="text-slate-700 max-w-2xl">
            Site content ownership and usage rights.
          </p>
        </div>
      </Section>

      {/* Content */}
      <Section>
        <div className="container max-w-3xl space-y-8">

          <div>
            <h3 className="text-xl font-semibold mb-3">© Copyright</h3>
            <p className="text-slate-700">
              All content on the Amanuel Travel website, including text, graphics, logos, images, and design, is the property of <strong>Amanuel Travel Agency</strong> and protected by copyright law.
            </p>
            <p className="text-slate-700 mt-3">
              © 2025–2026 Amanuel Travel Agency. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Permitted Use</h3>
            <p className="text-slate-700">
              You may:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>View and print pages for personal, non-commercial use</li>
              <li>Share links to our website</li>
              <li>Quote excerpts with proper attribution</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Prohibited Use</h3>
            <p className="text-slate-700">
              Without written permission, you may not:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-700">
              <li>Reproduce, republish, or distribute our content</li>
              <li>Use our content in commercial products or services</li>
              <li>Modify or create derivative works from our content</li>
              <li>Remove copyright or attribution notices</li>
              <li>Scrape or automatically download content</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Third-Party Content</h3>
            <p className="text-slate-700">
              Our website may contain links to third-party websites and services. We do not control their content and are not responsible for their accuracy, legality, or appropriateness.
            </p>
            <p className="text-slate-700 mt-3">
              If content on our site infringes your copyright, please contact us immediately.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Attribution</h3>
            <p className="text-slate-700 mb-3">
              If you share or quote our content, please attribute it to:
            </p>
            <p className="text-slate-700 font-semibold">
              Amanuel Travel Agency
            </p>
            <p className="text-slate-700 text-sm">
              Example: &ldquo;According to Amanuel Travel Agency...&rdquo;
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Permission Requests</h3>
            <p className="text-slate-700">
              To request permission to use our content, email us:
            </p>
            <p className="text-slate-700 mt-3">
              <strong>Email:</strong> <a href={`mailto:${BRAND.email}`} className="text-accent/90 hover:underline">{BRAND.email}</a>
            </p>
            <p className="text-slate-700 mt-3">
              Include details about your intended use, and we&apos;ll get back to you.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded border border-slate-200">
            <p className="text-sm text-slate-600">
              <strong>Last updated:</strong> January 2026
            </p>
          </div>

        </div>
      </Section>

      {/* Footer CTA */}
      <Section className="bg-slate-50">
        <div className="container max-w-2xl text-center">
          <a
            href={`https://wa.me/${encodeURIComponent(BRAND.whatsapp)}`}
            className="inline-block bg-accent/90 text-white px-6 py-3 rounded-md font-semibold hover:bg-accent transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </Section>
    </div>
  )
}
