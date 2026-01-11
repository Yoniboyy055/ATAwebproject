/**
 * JSON-LD Schema markup generators for SEO
 * Helps Google understand your content and improve search results
 */

import { BRAND } from './config'

export interface SchemaData {
  '@context': string
  '@type': string
  [key: string]: unknown
}

/**
 * Organization Schema - Main business info
 */
export function generateOrganizationSchema(): SchemaData {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: BRAND.name,
    description: 'Premium travel agency specializing in Eritrea, Ethiopia, and diaspora travel services',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.svg`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.addressLine1,
      addressLocality: 'Asmara',
      addressRegion: 'Anseba',
      addressCountry: 'ER',
      postalCode: '220',
    },
    telephone: `+${BRAND.phoneMobile}`,
    email: BRAND.email,
    sameAs: [
      'https://wa.me/2917197086',
      'https://www.facebook.com/amanueltravel',
      'https://www.instagram.com/amanueltravel',
    ],
    areaServed: ['CA', 'US', 'UK', 'AU', 'ER', 'ET'],
    priceRange: '$$$',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '500',
      reviewCount: '500',
    },
  }
}

/**
 * Travel Package Schema - For package listings
 */
export function generateTravelPackageSchema(packageData: {
  title: string
  description: string
  price: number
  duration: string
  destination: string
  rating?: number
  reviewCount?: number
  image?: string
}): SchemaData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Package',
    name: packageData.title,
    description: packageData.description,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/packages/${packageData.destination}`,
    image: packageData.image || `${process.env.NEXT_PUBLIC_BASE_URL}/default-package.jpg`,
    offers: {
      '@type': 'Offer',
      price: packageData.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    duration: packageData.duration,
    destinationName: packageData.destination,
    itinerary: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: `Explore ${packageData.destination}`,
        },
      ],
    },
    ...(packageData.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: packageData.rating,
        reviewCount: packageData.reviewCount || 0,
      },
    }),
    organizer: {
      '@type': 'Organization',
      name: BRAND.name,
    },
  }
}

/**
 * LocalBusiness Schema - For local search
 */
export function generateLocalBusinessSchema(): SchemaData {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': process.env.NEXT_PUBLIC_BASE_URL,
    name: BRAND.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BRAND.addressLine1,
      addressLocality: 'Asmara',
      addressCountry: 'ER',
    },
    telephone: `+${BRAND.phoneMobile}`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
    url: process.env.NEXT_PUBLIC_BASE_URL,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 15.3329,
      longitude: 38.9467,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
    ],
  }
}

/**
 * BreadcrumbList Schema - For navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * AggregateRating Schema - For reviews/testimonials
 */
export function generateAggregateRatingSchema(data: {
  name: string
  ratingValue: number
  ratingCount: number
  reviewCount: number
}): SchemaData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: data.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.ratingValue,
      ratingCount: data.ratingCount,
      reviewCount: data.reviewCount,
    },
  }
}

/**
 * FAQPage Schema - For FAQ section
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): SchemaData {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
