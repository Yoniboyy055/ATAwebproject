import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /proof-ledger is a private ledger and is never indexed.
      disallow: ['/admin', '/api', '/.well-known', '/proof-ledger'],
      crawlDelay: 0,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
