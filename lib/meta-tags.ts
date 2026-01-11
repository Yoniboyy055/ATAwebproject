import { Metadata } from 'next';

interface MetaTagsConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  author?: string;
  type?: 'website' | 'article' | 'product';
  ogType?: string;
  twitterHandle?: string;
}

const DEFAULT_IMAGE = '/og-image.jpg';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://amanueltravel.com';

export function generateMetaTags(config: MetaTagsConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = DEFAULT_IMAGE,
    url = SITE_URL,
    author = 'Amanuel Travel Agency',
    ogType = 'website',
    twitterHandle = '@AmanuelTravel',
  } = config;

  const fullTitle = `${title} — Amanuel Travel Agency`;
  const fullUrl = url.startsWith('http') ? url : `${SITE_URL}${url}`;
  const fullImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      ...keywords,
      'travel agency',
      'flights',
      'visa assistance',
      'Eritrea',
      'Ethiopia',
      'Africa travel',
    ],
    authors: [{ name: author }],
    creator: author,
    publisher: 'Amanuel Travel Agency',
    openGraph: {
      type: ogType as 'website' | 'article' | 'book' | 'profile',
      locale: 'en_US',
      url: fullUrl,
      siteName: 'Amanuel Travel Agency',
      title: fullTitle,
      description,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      creator: twitterHandle,
      title: fullTitle,
      description,
      images: [fullImage],
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

export function generateBlogPostMetaTags(post: {
  title: string;
  excerpt: string;
  slug: string;
  author?: string;
  publishedAt?: Date;
  image?: string;
  tags?: string[];
}): Metadata {
  const url = `/blog/${post.slug}`;
  const keywords = post.tags || ['travel', 'blog', 'tips'];

  return generateMetaTags({
    title: post.title,
    description: post.excerpt,
    keywords: [...keywords, 'travel guide', 'travel tips'],
    image: post.image,
    url,
    author: post.author || 'Amanuel Travel',
    type: 'article',
    ogType: 'article',
  });
}

export function generateDestinationMetaTags(destination: {
  name: string;
  description: string;
  country: string;
  slug: string;
  image?: string;
}): Metadata {
  const url = `/destinations/${destination.slug}`;
  const keywords = [destination.name, destination.country, 'travel destination'];

  return generateMetaTags({
    title: `${destination.name} Travel Guide & Packages`,
    description: destination.description,
    keywords,
    image: destination.image,
    url,
    type: 'website',
  });
}

export function generatePackageMetaTags(pkg: {
  name: string;
  description: string;
  destination: string;
  slug: string;
  price?: number;
  image?: string;
}): Metadata {
  const url = `/packages/${pkg.slug}`;
  const priceStr = pkg.price ? ` — from $${pkg.price}` : '';
  const keywords = [pkg.destination, 'tour package', 'travel deal'];

  return generateMetaTags({
    title: `${pkg.name}${priceStr}`,
    description: pkg.description,
    keywords,
    image: pkg.image,
    url,
    type: 'product',
  });
}
