'use client';

import { useState, useEffect } from 'react';
import AdvancedSearchForm from '@/components/AdvancedSearchForm';
import SearchResults from '@/components/SearchResults';
import { SearchFilters, searchPackages, saveSearch, getSavedSearches, SavedSearch, SearchResult } from '@/lib/search';

export default function SearchPage() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sortBy, setSortBy] = useState('price-low');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  // Load saved searches on mount
  useEffect(() => {
    setSavedSearches(getSavedSearches());
  }, []);

  const handleSearch = (filters: SearchFilters) => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const searchResults = searchPackages(filters, sortBy as 'price-low' | 'price-high' | 'rating' | 'duration');
      setResults(searchResults);
      setIsLoading(false);
    }, 500);
  };

  const handleSaveSearch = (name: string, filters: SearchFilters) => {
    const saved = saveSearch(name, filters);
    setSavedSearches([...savedSearches, saved]);
    alert(`✓ Search saved as "${name}"`);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    if (results.length > 0) {
      const filters: SearchFilters = {}; // Would need to track current filters
      const newResults = searchPackages(filters, newSort as 'price-low' | 'price-high' | 'rating' | 'duration');
      setResults(newResults);
    }
  };

  const handleLoadSavedSearch = (search: SavedSearch) => {
    handleSearch(search.filters);
    setShowSavedSearches(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🌍 Advanced Travel Package Search
          </h1>
          <p className="text-slate-600 text-lg">
            Find the perfect package tailored to your budget, duration, and travel style
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Search Form */}
          <div className="lg:col-span-1">
            <AdvancedSearchForm onSearch={handleSearch} onSaveSearch={handleSaveSearch} />

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-blue-600 text-white p-4">
                  <h3 className="font-bold text-lg">💾 Saved Searches ({savedSearches.length})</h3>
                </div>
                <div className="p-4 space-y-2">
                  {savedSearches.slice(0, 5).map((search) => (
                    <button
                      key={search.id}
                      onClick={() => handleLoadSavedSearch(search)}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <div className="font-semibold text-blue-900">{search.name}</div>
                      <div className="text-xs text-blue-700 mt-1">
                        {new Date(search.createdAt).toLocaleDateString()}
                      </div>
                    </button>
                  ))}
                  {savedSearches.length > 5 && (
                    <button
                      onClick={() => setShowSavedSearches(!showSavedSearches)}
                      className="w-full p-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      View All →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Search Results */}
          <div className="lg:col-span-2">
            {results.length > 0 ? (
              <SearchResults
                results={results}
                sortBy={sortBy}
                onSortChange={handleSortChange}
                isLoading={isLoading}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-8xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Start Your Search</h3>
                <p className="text-slate-600 mb-4">
                  Use the advanced search form to filter by destination, budget, duration, and travel style.
                  We'll show you the best matching packages.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-6">
                  <p className="text-sm text-emerald-800">
                    <strong>💡 Tip:</strong> You can save your searches to quickly find similar packages
                    in the future!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
