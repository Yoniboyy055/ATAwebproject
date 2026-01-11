// Advanced search and filtering utilities

export interface SearchFilters {
  destination?: string;
  checkIn?: Date;
  checkOut?: Date;
  travelers?: number;
  budget?: {
    min: number;
    max: number;
  };
  duration?: {
    min: number;
    max: number;
  };
  rating?: number;
  categories?: string[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  priceAlert?: {
    enabled: boolean;
    targetPrice: number;
    notified: boolean;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  destination: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  duration: number;
  category: string;
  image: string;
  discount?: number;
  availability: boolean;
  tags: string[];
}

// Mock database - replace with real API calls
export const mockPackages: SearchResult[] = [
  {
    id: '1',
    title: 'Eritrea Paradise Tour',
    destination: 'Eritrea',
    description: 'Experience the beauty of Massawa beaches and Asmara city culture',
    price: 1200,
    originalPrice: 1500,
    rating: 4.8,
    reviews: 124,
    duration: 5,
    category: 'beach',
    image: '/packages/eritrea-tour.jpg',
    discount: 20,
    availability: true,
    tags: ['beach', 'cultural', 'beginner-friendly'],
  },
  {
    id: '2',
    title: 'Ethiopia Adventure Expedition',
    destination: 'Ethiopia',
    description: 'Trek the Simien Mountains and explore historic Lalibela',
    price: 1800,
    originalPrice: 2100,
    rating: 4.9,
    reviews: 89,
    duration: 8,
    category: 'adventure',
    image: '/packages/ethiopia-adventure.jpg',
    discount: 14,
    availability: true,
    tags: ['adventure', 'hiking', 'cultural'],
  },
  {
    id: '3',
    title: 'Honeymoon in Massawa',
    destination: 'Eritrea',
    description: 'Romantic beach getaway with luxury accommodation and sunset cruises',
    price: 2500,
    rating: 4.7,
    reviews: 56,
    duration: 4,
    category: 'honeymoon',
    image: '/packages/massawa-honeymoon.jpg',
    availability: true,
    tags: ['honeymoon', 'luxury', 'beach', 'romantic'],
  },
  {
    id: '4',
    title: 'Family Fun Week',
    destination: 'Ethiopia',
    description: 'Perfect family package with wildlife safari and cultural experiences',
    price: 1600,
    originalPrice: 1950,
    rating: 4.6,
    reviews: 78,
    duration: 7,
    category: 'family',
    image: '/packages/ethiopia-family.jpg',
    discount: 18,
    availability: true,
    tags: ['family', 'safari', 'educational'],
  },
  {
    id: '5',
    title: 'Luxury Asmara Retreat',
    destination: 'Eritrea',
    description: 'Upscale city experience with fine dining and boutique hotels',
    price: 3000,
    rating: 4.9,
    reviews: 42,
    duration: 3,
    category: 'luxury',
    image: '/packages/asmara-luxury.jpg',
    availability: true,
    tags: ['luxury', 'city', 'upscale'],
  },
  {
    id: '6',
    title: 'Budget Explorer Special',
    destination: 'Eritrea',
    description: 'Affordable package covering Asmara and Massawa with basic comfort',
    price: 650,
    originalPrice: 800,
    rating: 4.3,
    reviews: 156,
    duration: 4,
    category: 'budget',
    image: '/packages/eritrea-budget.jpg',
    discount: 19,
    availability: true,
    tags: ['budget', 'cultural', 'city', 'beach'],
  },
];

// Search and filter logic
export function searchPackages(
  filters: SearchFilters,
  sortBy: 'price-low' | 'price-high' | 'rating' | 'duration' = 'price-low'
): SearchResult[] {
  let results = [...mockPackages];

  // Filter by destination
  if (filters.destination) {
    results = results.filter(
      (pkg) =>
        pkg.destination.toLowerCase().includes(filters.destination!.toLowerCase()) ||
        pkg.title.toLowerCase().includes(filters.destination!.toLowerCase())
    );
  }

  // Filter by budget
  if (filters.budget) {
    results = results.filter(
      (pkg) => pkg.price >= filters.budget!.min && pkg.price <= filters.budget!.max
    );
  }

  // Filter by duration
  if (filters.duration) {
    results = results.filter(
      (pkg) => pkg.duration >= filters.duration!.min && pkg.duration <= filters.duration!.max
    );
  }

  // Filter by rating
  if (filters.rating) {
    results = results.filter((pkg) => pkg.rating >= filters.rating!);
  }

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    results = results.filter((pkg) => filters.categories!.includes(pkg.category));
  }

  // Sort results
  switch (sortBy) {
    case 'price-high':
      results.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      results.sort((a, b) => b.rating - a.rating);
      break;
    case 'duration':
      results.sort((a, b) => a.duration - b.duration);
      break;
    case 'price-low':
    default:
      results.sort((a, b) => a.price - b.price);
  }

  return results;
}

// Save search functionality
export function saveSearch(
  name: string,
  filters: SearchFilters,
  enablePriceAlert?: boolean,
  targetPrice?: number
): SavedSearch {
  const savedSearch: SavedSearch = {
    id: Date.now().toString(),
    name,
    filters,
    createdAt: new Date(),
    priceAlert:
      enablePriceAlert && targetPrice
        ? {
            enabled: true,
            targetPrice,
            notified: false,
          }
        : undefined,
  };

  // In production, save to database
  localStorage.setItem(`search_${savedSearch.id}`, JSON.stringify(savedSearch));
  return savedSearch;
}

// Get saved searches
export function getSavedSearches(): SavedSearch[] {
  const searches: SavedSearch[] = [];

  if (typeof window !== 'undefined') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('search_')) {
        const data = localStorage.getItem(key);
        if (data) {
          searches.push(JSON.parse(data));
        }
      }
    }
  }

  return searches;
}

// Delete saved search
export function deleteSavedSearch(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`search_${id}`);
  }
}

// Check price drops and trigger alerts
export function checkPriceAlerts(searches: SavedSearch[]): SavedSearch[] {
  return searches.map((search) => {
    if (!search.priceAlert || search.priceAlert.notified) {
      return search;
    }

    const results = searchPackages(search.filters);
    const hasDroppedPrice = results.some(
      (pkg) => pkg.price <= search.priceAlert!.targetPrice
    );

    if (hasDroppedPrice) {
      return {
        ...search,
        priceAlert: {
          ...search.priceAlert,
          notified: true,
        },
      };
    }

    return search;
  });
}
