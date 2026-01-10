import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/.well-known'],
      crawlDelay: 0,
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
