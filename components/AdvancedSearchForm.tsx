'use client';

import { useState } from 'react';
import { SearchFilters } from '@/lib/search';

interface AdvancedSearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onSaveSearch?: (name: string, filters: SearchFilters) => void;
}

const CATEGORIES = [
  { id: 'beach', label: '🏖️ Beach' },
  { id: 'adventure', label: '⛰️ Adventure' },
  { id: 'city', label: '🏙️ City' },
  { id: 'family', label: '👨‍👩‍👧‍👦 Family' },
  { id: 'honeymoon', label: '💑 Honeymoon' },
  { id: 'luxury', label: '✨ Luxury' },
];

export default function AdvancedSearchForm({ onSearch, onSaveSearch }: AdvancedSearchFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [destination, setDestination] = useState('');
  // Note: checkIn and checkOut are prepared for future date-range functionality
  // const [checkIn, setCheckIn] = useState('');
  // const [checkOut, setCheckOut] = useState('');
  const [travelers, setTravelers] = useState(1);
  const [minBudget, setMinBudget] = useState(500);
  const [maxBudget, setMaxBudget] = useState(5000);
  const [minDuration, setMinDuration] = useState(1);
  const [maxDuration, setMaxDuration] = useState(14);
  const [minRating, setMinRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveOption, setShowSaveOption] = useState(false);

  const handleSearch = () => {
    const filters: SearchFilters = {
      destination: destination || undefined,
      budget: { min: minBudget, max: maxBudget },
      duration: { min: minDuration, max: maxDuration },
      rating: minRating > 0 ? minRating : undefined,
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      travelers: travelers > 1 ? travelers : undefined,
    };

    onSearch(filters);
  };

  const handleSaveSearch = () => {
    if (saveSearchName.trim() && onSaveSearch) {
      const filters: SearchFilters = {
        destination: destination || undefined,
        budget: { min: minBudget, max: maxBudget },
        duration: { min: minDuration, max: maxDuration },
        rating: minRating > 0 ? minRating : undefined,
        categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        travelers: travelers > 1 ? travelers : undefined,
      };

      onSaveSearch(saveSearchName, filters);
      setSaveSearchName('');
      setShowSaveOption(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const resetFilters = () => {
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setTravelers(1);
    setMinBudget(500);
    setMaxBudget(5000);
    setMinDuration(1);
    setMaxDuration(14);
    setMinRating(0);
    setSelectedCategories([]);
    setSaveSearchName('');
    setShowSaveOption(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">🔍 Advanced Search</h2>
        <p className="text-emerald-100">Find your perfect travel package with custom filters</p>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {/* Basic Info Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              🌍 Destination
            </label>
            <input
              type="text"
              placeholder="e.g., Eritrea, Ethiopia, Cairo"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              👥 Travelers
            </label>
            <select
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} {i === 0 ? 'Person' : 'People'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            💰 Budget: ${minBudget} - ${maxBudget}
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="100"
                max="5000"
                value={minBudget}
                onChange={(e) => setMinBudget(Math.min(parseInt(e.target.value), maxBudget))}
                className="w-full"
              />
              <div className="text-xs text-slate-600 mt-1">Min: ${minBudget}</div>
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="100"
                max="5000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Math.max(parseInt(e.target.value), minBudget))}
                className="w-full"
              />
              <div className="text-xs text-slate-600 mt-1">Max: ${maxBudget}</div>
            </div>
          </div>
        </div>

        {/* Duration Range */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            ⏱️ Duration: {minDuration} - {maxDuration} days
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="30"
                value={minDuration}
                onChange={(e) => setMinDuration(Math.min(parseInt(e.target.value), maxDuration))}
                className="w-full"
              />
              <div className="text-xs text-slate-600 mt-1">Min: {minDuration} days</div>
            </div>
            <div className="flex-1">
              <input
                type="range"
                min="1"
                max="30"
                value={maxDuration}
                onChange={(e) => setMaxDuration(Math.max(parseInt(e.target.value), minDuration))}
                className="w-full"
              />
              <div className="text-xs text-slate-600 mt-1">Max: {maxDuration} days</div>
            </div>
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            ⭐ Minimum Rating: {minRating > 0 ? `${minRating.toFixed(1)}+` : 'Any'}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-slate-600 mt-1">
            {minRating > 0 ? `Showing packages rated ${minRating}+` : 'All ratings'}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3">
            📋 Travel Style (select multiple)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-3 rounded-lg font-medium transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSearch}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            🔍 Search Packages
          </button>
          <button
            onClick={() => setShowSaveOption(!showSaveOption)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            💾 Save Search
          </button>
          <button
            onClick={resetFilters}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
          >
            ↺ Reset
          </button>
        </div>

        {/* Save Search Input */}
        {showSaveOption && (
          <div className="flex gap-2 pt-2 border-t">
            <input
              type="text"
              placeholder="Give this search a name (e.g., 'Spring Eritrea Trip')"
              value={saveSearchName}
              onChange={(e) => setSaveSearchName(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              onClick={handleSaveSearch}
              disabled={!saveSearchName.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
