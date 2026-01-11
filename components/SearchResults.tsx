'use client';

import Link from 'next/link';
import { SearchResult } from '@/lib/search';

interface SearchResultsProps {
  results: SearchResult[];
  sortBy: string;
  onSortChange: (sort: string) => void;
  isLoading?: boolean;
}

export default function SearchResults({
  results,
  sortBy,
  onSortChange,
  isLoading = false,
}: SearchResultsProps) {
  const SORT_OPTIONS = [
    { value: 'price-low', label: '💰 Price: Low to High' },
    { value: 'price-high', label: '💰 Price: High to Low' },
    { value: 'rating', label: '⭐ Rating: Highest First' },
    { value: 'duration', label: '⏱️ Duration: Shortest First' },
  ];

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-emerald-200"></div>
        <p className="mt-4 text-slate-600 font-semibold">Searching packages...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="bg-slate-50 rounded-lg p-12 text-center">
        <div className="text-6xl mb-4">🔎</div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Packages Found</h3>
        <p className="text-slate-600 mb-6">
          Try adjusting your filters or search criteria to find more options.
        </p>
        <Link
          href="/search"
          className="inline-block px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
        >
          ← Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-900">
          Found <span className="text-emerald-600">{results.length}</span> Packages
        </h2>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid gap-6">
        {results.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col md:flex-row"
          >
            {/* Image */}
            <div className="md:w-64 h-48 md:h-auto bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
              <div className="text-6xl">📦</div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{pkg.title}</h3>
                    <p className="text-sm text-slate-600">{pkg.destination}</p>
                  </div>
                  {pkg.discount && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -{pkg.discount}%
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-3 line-clamp-2">{pkg.description}</p>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className="font-semibold">{pkg.rating.toFixed(1)}</span>
                    <span className="text-slate-500">({pkg.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⏱️</span>
                    <span className="font-semibold">{pkg.duration}</span>
                    <span className="text-slate-500">days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🏷️</span>
                    <span className="text-slate-500 capitalize">{pkg.category}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {pkg.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">${pkg.price}</div>
                  {pkg.originalPrice && (
                    <div className="text-sm text-slate-500 line-through">
                      ${pkg.originalPrice}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors">
                    💾 Save
                  </button>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
