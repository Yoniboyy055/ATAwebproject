/**
 * Blog post data structure and utilities
 */

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: 'destination' | 'travel-tips' | 'visa' | 'cultural'
  tags: string[]
  image: string
  imageAlt: string
  publishedAt: Date
  updatedAt: Date
  readingTime: number
  featured: boolean
}

/**
 * Sample blog posts - can be extended with database
 */
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'eritrea-travel-guide-2024',
    title: 'Complete Eritrea Travel Guide: Everything You Need to Know',
    excerpt: 'Discover the hidden gem of the Horn of Africa. Complete guide to Eritrea travel including visa, budget, culture, and top destinations.',
    category: 'destination',
    tags: ['eritrea', 'travel-guide', 'beginner-friendly'],
    author: 'Amanuel Travel Team',
    image: '/blog/eritrea-guide.jpg',
    imageAlt: 'Asmara city streets with colonial architecture',
    publishedAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    readingTime: 12,
    featured: true,
    content: `
# Complete Eritrea Travel Guide 2024

Eritrea is one of Africa's most underrated destinations. Nestled on the Red Sea coast, this small nation offers stunning beaches, vibrant culture, and rich history.

## Why Visit Eritrea?

- **Untouched beaches**: Massawa and the Dahlak Islands are pristine
- **UNESCO sites**: Asmara's Italian colonial architecture
- **Unique culture**: Tigrinya heritage and traditions
- **Affordable**: Lower costs compared to neighboring countries
- **Warm hospitality**: Welcoming people and communities

## Best Time to Visit

October to April offers the best weather with temperatures between 20-30°C.

## Top Destinations

### 1. Asmara
The capital city features stunning Italian colonial architecture, vibrant street life, and excellent local cuisine.

### 2. Massawa
Red Sea coastal town famous for water sports, beaches, and seafood.

### 3. Dahlak Islands
Untouched archipelago perfect for diving, snorkeling, and island hopping.

## Visa Requirements

Most visitors can obtain a visa on arrival or through your nearest Eritrean embassy. Processing takes 3-5 days typically.

## Budget

Daily budget: $40-80 USD depending on your preferences
- Budget hotels: $15-25/night
- Food: $5-15 per meal
- Activities: $10-30 per day
    `,
  },
  {
    id: '2',
    slug: 'massawa-red-sea-beaches',
    title: 'Massawa Red Sea: Complete Beach & Water Sports Guide',
    excerpt: 'Explore Massawa\'s pristine Red Sea beaches, diving spots, and water activities. Everything you need for an unforgettable beach vacation.',
    category: 'destination',
    tags: ['massawa', 'beaches', 'water-sports', 'diving'],
    author: 'Amanuel Travel Team',
    image: '/blog/massawa-beaches.jpg',
    imageAlt: 'Crystal clear waters at Massawa with coral reefs',
    publishedAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    readingTime: 10,
    featured: true,
    content: `
# Massawa Red Sea: Complete Beach Guide

Massawa is Eritrea's primary port city and a hidden gem for beach lovers. The Red Sea waters are incredibly clear with vibrant coral reefs.

## Top Beaches

### Gurgusum Beach
Best for: Swimming, relaxation
- Clear warm waters
- Local restaurants nearby
- Good for families

### Sheib Beach
Best for: Water sports, diving
- Excellent coral reefs
- Professional dive centers
- Strong for experienced swimmers

## Water Activities

- **Diving**: PADI certified operators available
- **Snorkeling**: Dahlak Islands day trips
- **Fishing**: Deep-sea fishing charters
- **Boating**: Island hopping tours

## Where to Stay

- Massawa Asmara Hotel: 4-star beachfront
- Red Sea Resort: Mid-range, great value
- Guesthouse options: Budget-friendly

## Best Season

October-April for comfortable weather and calm waters.
    `,
  },
  {
    id: '3',
    slug: 'visa-requirements-canada-eritrea',
    title: 'Eritrea Visa Guide for Canadian Travelers (2024)',
    excerpt: 'Step-by-step guide for Canadian citizens getting Eritrea visa. Processing times, documents needed, and embassy contacts.',
    category: 'visa',
    tags: ['visa', 'canada', 'requirements', 'documents'],
    author: 'Amanuel Travel Team',
    image: '/blog/visa-guide.jpg',
    imageAlt: 'Eritrean passport and visa documents',
    publishedAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    readingTime: 8,
    featured: true,
    content: `
# Eritrea Visa Guide for Canadians

## Visa Options

### Option 1: Visa on Arrival
- **Duration**: 30 days
- **Cost**: USD 50-100
- **Processing**: Upon arrival (1-2 hours)
- **Documents needed**: Passport valid 6+ months

### Option 2: Embassy Visa
- **Duration**: 30-90 days
- **Cost**: USD 100-150
- **Processing**: 3-5 business days
- **Documents**: Passport, application form, photo, proof of funds

## Step-by-Step Process

1. Check if you need visa through local embassy
2. Prepare documents
3. Submit application
4. Pay visa fee
5. Collect passport
6. Arrive in Eritrea!

## Required Documents

- Valid Canadian passport (6+ months validity)
- Completed visa application
- One passport-sized photo (4x4 cm)
- Proof of accommodation
- Return ticket
- Proof of sufficient funds

## Processing Times

- Visa on arrival: 1-2 hours
- Embassy visa: 3-5 business days
- Express (if available): 24 hours

## Tips

- Apply in advance to embassy for easier process
- Have digital copies of all documents
- Confirm embassy hours before visiting
- Use our visa application service to simplify process
    `,
  },
  {
    id: '4',
    slug: 'travel-tips-packing-eritrea',
    title: '10 Essential Packing Tips for Eritrea Travel',
    excerpt: 'What to pack for Eritrea? Complete packing checklist for beaches, deserts, and cultural sites.',
    category: 'travel-tips',
    tags: ['packing', 'tips', 'what-to-bring', 'preparation'],
    author: 'Amanuel Travel Team',
    image: '/blog/packing-tips.jpg',
    imageAlt: 'Well-organized travel backpack and suitcase',
    publishedAt: new Date('2023-12-28'),
    updatedAt: new Date('2023-12-28'),
    readingTime: 7,
    featured: false,
    content: `
# 10 Essential Packing Tips for Eritrea

## Clothing

1. **Light, breathable fabrics** - Cotton and linen are best
2. **Sun protection** - Wide-brimmed hat, sunglasses
3. **Beach wear** - Swimsuit, cover-up
4. **Comfortable walking shoes** - For exploring cities
5. **Modest clothing** - Respect local culture (shoulders/knees covered)
6. **Light jacket** - For cooler evenings

## Health & Toiletries

- Sunscreen (high SPF)
- Insect repellent
- Basic medications
- Malaria prophylaxis (consult doctor)
- Toilet paper/feminine hygiene products

## Electronics

- Universal power adapter
- Phone charger
- Portable power bank
- Camera for photos

## Documents

- Passport (original)
- Copies of important documents
- Travel insurance documents
- Vaccination certificates

## Money & Cards

- Mix of cash (USD) and cards
- Notify bank of travel dates
- Keep emergency cash separate

## Pro Tips

- Pack light - bring carry-on only if possible
- Leave room in luggage for souvenirs
- Check baggage allowance beforehand
- Take one outfit in carry-on
    `,
  },
]

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((post) => post.featured).sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
}

export function getPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter((post) => post.category === category)
}

export function searchPosts(query: string): BlogPost[] {
  const lowerQuery = query.toLowerCase()
  return blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}
