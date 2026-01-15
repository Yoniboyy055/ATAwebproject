export const BRAND = {
  name: 'Amanuel Travel Agency',
  addressLine1: 'Alfa Building, 1st Floor, Office #5',
  addressLine2: 'Managing Director',
  city: 'Asmara, Eritrea',
  phoneOffice: '002911180240',
  phoneMobile: '002917197086',
  email: 'amanueltravel@gmail.com',
  whatsappNumber: '2917197086',
  whatsappLink: 'https://wa.me/2917197086',
  whatsapp: '2917197086', // legacy field for backward compatibility
  location: 'Asmara, Eritrea' // legacy field for backward compatibility
}

export const packages = [
  {
    id: 'complete_trip_local',
    type: 'Local',
    title: 'Complete Trip Support (Local)',
    recommended: false,
    includes: [
      'Flight options + best routing',
      'Date flexibility planning (save money)',
      'Visa/document checklist (guidance)',
      'Hotel suggestions (if needed)',
      'WhatsApp support until confirmed'
    ],
    note: 'Fast, clear support—no confusion.'
  },
  {
    id: 'family_group_local',
    type: 'Local',
    title: 'Family / Group Trip Builder',
    recommended: true,
    includes: [
      'Multi-passenger routing + timing',
      'Seat/baggage guidance (airline-dependent)',
      'Stopover planning',
      'Document checklist for each traveler',
      'Priority WhatsApp coordination'
    ]
  },
  {
    id: 'homecoming_plus',
    type: 'Diaspora',
    title: 'Homecoming Plus (Diaspora)',
    recommended: false,
    includes: [
      'Best route planning (min stops / best timing)',
      'Arrival coordination guidance (pickup support if available)',
      'Hotel/stay suggestions',
      'Family coordination (multiple arrivals)',
      'WhatsApp concierge support'
    ]
  },
  {
    id: 'full_concierge_diaspora',
    type: 'Diaspora',
    title: 'Full Concierge Trip (Diaspora)',
    recommended: false,
    includes: [
      'Flights + routing + stopovers',
      'Visa/document guidance + reminders',
      'Hotel/stay coordination',
      'Transport coordination (where available)',
      'Ongoing WhatsApp support + changes guidance'
    ],
    note: 'Built for diaspora travelers who want full support.'
  }
]

// Builder.io Configuration
export const BUILDER_CONFIG = {
  // API Key - should be NEXT_PUBLIC_BUILDER_API_KEY in environment
  apiKey: process.env.NEXT_PUBLIC_BUILDER_API_KEY || "",
  
  // Site URL for Builder.io project
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  
  // Model names in Builder.io Data Models
  models: {
    page: "page",
    package: "package",
  },
  
  // ISR Revalidation times (in seconds)
  revalidate: {
    pages: 300, // 5 minutes
    packagesList: 3600, // 1 hour
    packageDetail: 3600, // 1 hour
    homepage: 300, // 5 minutes
  },
};

// Allowed Builder block types for safety
export const APPROVED_BLOCKS = [
  "Hero",
  "TrustBar",
  "PromoBanner",
  "PackagesGrid",
  "FeaturedPackagesCarousel",
  "PackageHighlights",
  "ItineraryTimeline",
  "Gallery",
  "PricingBox",
  "ImportantInfo",
  "FAQ",
  "CTAContact",
] as const;

export type ApprovedBlockType = (typeof APPROVED_BLOCKS)[number];

// Feature flags
export const FEATURES = {
  debugMode: process.env.NODE_ENV === "development",
  enableEdgeCache: true,
};
