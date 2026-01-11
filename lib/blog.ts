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
  {
    id: '5',
    slug: 'diaspora-return-guide',
    title: 'Diaspora Return Guide: Planning Your Homecoming Trip',
    excerpt: 'Ultimate guide for diaspora communities returning home. Emotional preparation, logistics, and making the most of your visit.',
    category: 'travel-tips',
    tags: ['diaspora', 'home-visit', 'return', 'emotional-journey'],
    author: 'Amanuel Travel Team',
    image: '/blog/diaspora-return.jpg',
    imageAlt: 'Family reunion at airport terminal',
    publishedAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    readingTime: 14,
    featured: true,
    content: `
# Diaspora Return Guide: Planning Your Homecoming

Returning home after years of absence is an emotional and exciting experience. This guide helps you prepare for the journey, reconnect with family, and maximize your time.

## Emotional Preparation

### Before You Go
- Prepare yourself mentally for changes in your hometown
- Reconnect with family on video calls
- Research how the place has changed
- Set realistic expectations
- Plan meaningful activities with loved ones

### Common Feelings
- Excitement mixed with nervousness
- Nostalgia and homesickness
- Gratitude for opportunities abroad
- Curiosity about what's changed

## Practical Planning

### 1. Timing Your Visit
- **Best seasons**: October-April (weather-wise)
- **Duration**: 2-4 weeks recommended
- **Holidays**: Consider peak family times
- **Work schedule**: Plan leave in advance

### 2. Budget Breakdown
- **Flights**: $800-1500 (from North America)
- **Accommodation**: $200-400/week
- **Food & activities**: $300-500/week
- **Gifts for family**: $300-500
- **Buffer**: 20% extra for unexpected expenses

### 3. Packing Considerations
- Gifts from abroad (electronics, specialty items)
- Medications if needed
- Camera for capturing memories
- Comfortable clothing for climate
- Respectful attire for cultural sites

## Making Connections

### Family Time
- Plan multi-day gatherings
- Organize family dinners
- Visit extended family members
- Share stories and photos

### Community Reconnection
- Visit old friends
- Attend community gatherings
- Explore religious institutions
- Engage with local culture

### Professional Opportunities
- Network with local businesses
- Explore investment opportunities
- Mentor younger community members
- Establish ongoing connections

## Practical Tips

1. **Accommodation**: Stay with family if possible, hotel as backup
2. **Transportation**: Use local taxis or arrange driver service
3. **Communication**: Buy local SIM card for calls/data
4. **Money**: Mix of cash (USD) and cards
5. **Gifts**: Quality items but modest quantities
6. **Pace**: Don't overplan - allow time to relax
7. **Photography**: Ask permission before photos
8. **Respect**: Follow local customs and traditions

## Staying Connected After

- Regular video calls with family
- Share photos and videos
- Plan next visit while still fresh
- Send care packages periodically
- Support community initiatives

## Resources

- Book with Amanuel Travel for worry-free arrangements
- We can arrange family coordination
- Airport pickups and transfers included
- Customized itineraries for diaspora visits
    `,
  },
  {
    id: '6',
    slug: 'budget-travel-eritrea-ethiopia',
    title: 'Budget Travel Guide: Eritrea & Ethiopia for $50/Day',
    excerpt: 'Travel to Eritrea and Ethiopia on a tight budget. Money-saving tips, cheap eats, and affordable accommodation.',
    category: 'travel-tips',
    tags: ['budget', 'africa', 'money-saving', 'backpacking'],
    author: 'Amanuel Travel Team',
    image: '/blog/budget-travel.jpg',
    imageAlt: 'Local market in Addis Ababa bustling with activity',
    publishedAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
    readingTime: 11,
    featured: true,
    content: `
# Budget Travel to Eritrea & Ethiopia: $50/Day Guide

Yes, you can explore the Horn of Africa on a tight budget! Here's how to travel smart without sacrificing experiences.

## Daily Budget Breakdown ($50)

### Accommodation: $15-20
- Local guesthouses: $10-15/night
- Hostels (where available): $12-18/night
- Budget hotels: $15-25/night
- Airbnb budget rooms: $15-20/night

### Food: $15-20
- Street food meals: $2-5
- Local restaurants: $4-8
- Market groceries: $1-3 per meal
- Coffee shops: $0.50-1

### Activities & Transport: $15-20
- Local buses: $1-3
- Walking tours: Free-$5
- Museum entries: $3-7
- Activities: $5-15

## Money-Saving Strategies

### Food
1. **Eat like locals**: Skip tourist restaurants
2. **Market shopping**: Buy fruits, bread, cheese
3. **Street food**: Authentic and cheap
4. **Cooking**: Share kitchen in guesthouses
5. **Happy hours**: Some bars have discounts

### Accommodation
1. **Book direct**: Avoid platforms, negotiate
2. **Longer stays**: Get discounts (7+ days)
3. **Off-season**: Lower rates June-September
4. **Shared rooms**: Dorm or family rates
5. **House-sitting**: Connect with locals

### Transport
1. **Buses**: Cheapest option
2. **Shared taxis**: Good value and reliable
3. **Walking**: Great for cities
4. **Bikes**: Rent locally for $5-10/day
5. **Negotiate**: Taxi fares before entering

### Activities
1. **Free walking tours**: Tip-based
2. **Local guides**: Much cheaper than agencies
3. **Nature**: Hiking is free
4. **Community visits**: Often free or minimal fee
5. **Festivals**: Free cultural experiences

## Best Budget Destinations

### Eritrea
- **Asmara**: Budget-friendly, great nightlife
- **Massawa**: Cheap seafood and beaches
- **Keren**: Less touristy, authentic experience
- **Decemhare**: Mountain village, peaceful

### Ethiopia
- **Addis Ababa**: Affordable capital
- **Axum**: Historical sites
- **Lalibela**: Budget pilgrim guesthouses
- **Danakil Depression**: Organize group tours

## Sample Budget Itineraries

### 2-Week Trip: $700
- 12 nights accommodation: $180
- Food: $210
- Transport: $140
- Activities: $170

### 1-Month Trip: $1400
- 28 nights accommodation: $420
- Food: $420
- Transport: $280
- Activities: $280

## Pro Money-Saving Tips

1. **Travel slowly**: Less transport costs
2. **Make friends**: Share expenses
3. **Buy SIM card**: Cheaper calls/data than roaming
4. **Use ATMs wisely**: Minimize withdrawal fees
5. **Avoid tourist traps**: Eat where locals eat
6. **Travel off-peak**: Fewer tourists = better deals
7. **Learn basic phrases**: Good for negotiating
8. **Be flexible**: Take advantage of last-minute deals

## Reality Check

- You can do it, but sacrifice some comfort
- Not every experience is free
- Set aside emergency funds
- Quality guesthouses cost more
- Some experiences worth the splurge

### Worth the Extra Cost
- Reputable guides for safety
- Reliable accommodation in major cities
- Quality meals for special occasions
- Insurance and safety precautions

## Booking Resources

- **Accommodation**: Booking.com, Airbnb, local guesthouses
- **Flights**: Skyscanner, Google Flights
- **Tours**: Local guides, Amanuel Travel for customized budget options
- **Buses**: Book locally day-of
    `,
  },
  {
    id: '7',
    slug: 'cultural-etiquette-eritrea',
    title: 'Cultural Etiquette: How to Respect Local Customs in Eritrea',
    excerpt: 'Learn proper cultural etiquette, greetings, and customs to respectfully engage with Eritrean communities.',
    category: 'cultural',
    tags: ['culture', 'etiquette', 'respect', 'customs', 'traditions'],
    author: 'Amanuel Travel Team',
    image: '/blog/cultural-etiquette.jpg',
    imageAlt: 'Traditional Eritrean coffee ceremony',
    publishedAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
    readingTime: 9,
    featured: true,
    content: `
# Cultural Etiquette in Eritrea: A Respectful Traveler\'s Guide

Eritrea has rich traditions and deep cultural values. Understanding and respecting local customs ensures authentic experiences and positive interactions.

## Greetings & Introductions

### Proper Greetings
- **Tigrinya**: "Selam" (Hello)
- **Arabic**: "Salam alaikum" (Peace be upon you)
- **English**: English is spoken in cities
- **Handshake**: Standard in business
- **Eye contact**: Important sign of respect

### Greeting Customs
1. Greet elders first
2. Use right hand for greetings
3. Address people formally until invited otherwise
4. Use titles: Mr., Mrs., Ms.
5. Wait for invitation to use first names

## Dress Code

### In Cities (Asmara, Massawa)
- Smart casual is normal
- Nightclubs: Dress up slightly
- Religious sites: Cover shoulders and knees
- Beach areas: Modest swimwear

### In Rural Areas
- More conservative dress expected
- Cover shoulders and knees
- Avoid transparent clothing
- Respect local preferences

### Key Rules
- Women: Knee-length skirts, covered shoulders
- Men: Shorts acceptable in beach areas
- No swimwear in public (except beaches)
- Religious sites: Remove shoes if required

## Social Customs

### The Coffee Ceremony
- A sacred hospitality ritual
- Served in three rounds: Abol, Tasse, Baraka
- Accept all three rounds if possible
- Declining is seen as rude
- Enjoy the social interaction

### Dining Etiquette
1. Eat with right hand
2. Accept all offered food
3. Compliment the host
4. Don't leave food on plate
5. Remove shoes in some traditional homes
6. Wait for elders to eat first

### Business Customs
- Punctuality varies (flexible timing)
- Relationship-building before business
- Respect hierarchy in offices
- Business cards with right hand
- Small gifts appreciated but not expected

## Religious Respect

### Christian Orthodox Sites
- Remove shoes when entering
- Cover hair if female
- Photography may not be allowed
- Attend services respectfully
- No talking during services

### Muslim Sites
- Women cover heads in mosques
- Remove shoes
- Respect prayer times
- No disruptive photography
- Avoid prayers if non-Muslim

## Communication Norms

### Respectful Conversation
- Avoid discussing politics initially
- Personal questions are normal and friendly
- Family is important - ask about theirs
- Share about your family too
- Listen more than talk initially

### What to Avoid
- Disrespectful comments about government
- Negative remarks about Eritrea
- Excessive PDA (public displays of affection)
- Speaking loudly
- Rushing conversations
- Complaining about prices

## Photography & Media

### Guidelines
- Always ask before photographing people
- Respect "no" responses
- Sacred sites: Ask permission
- Children: Get parent permission
- Sensitive activities: Be discreet

### What's Generally OK
- Landscapes and nature
- Architecture (exterior)
- Street scenes (after asking)
- Markets (with permission)
- Tourist areas

## Gift Giving

### Appropriate Gifts
- Quality chocolate or candy
- Specialty items from your country
- Books about your homeland
- Crafts or souvenirs
- Coffee (quality)

### Avoid Giving
- Alcohol (unless confirmed acceptable)
- Leather products (to strict Muslims)
- Sharp objects (bad luck)
- Clocks (associated with death)
- Shoes (disrespectful)

## Time & Punctuality

### "Eritrean Time"
- Meetings may start late
- Flexible approach to schedules
- Relationship-focused rather than time-focused
- Don't be offended by delays
- Arrive on time regardless

## Gender Relations

### For Women Travelers
- Generally safe and respected
- Dress conservatively for safety
- Solo travel is acceptable
- Local women are friendly
- Avoid walking alone at night
- Groups are safer and more enjoyable

### For Male Travelers
- Respectful behavior expected
- No disrespectful comments about women
- Traditional roles are respected
- Be mindful of greetings with opposite gender

## Final Tips

1. **Show genuine interest**: People appreciate curiosity about their culture
2. **Learn basic Tigrinya**: Huge appreciation for effort
3. **Be patient**: Different pace of life than Western countries
4. **Show respect to elders**: Very important in society
5. **Accept hospitality graciously**: Refusing hurts feelings
6. **Smile and be friendly**: Goes a long way
7. **Don't bargain aggressively**: Relationship-based economy
8. **Ask permission**: For photos, stories, personal questions

## Common Phrases to Learn

- "Selam" - Hello
- "Megsti" - Thank you
- "Yikhalefi" - You're welcome
- "Ishi" - Okay/Alright
- "Adey" - Mother (sign of respect)
- "Ati" - Father (sign of respect)

## Resources

Book with Amanuel Travel and get cultural orientation guides, local guides who explain customs, and authentic experiences respectfully planned.
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
