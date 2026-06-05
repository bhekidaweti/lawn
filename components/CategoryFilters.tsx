'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Filter, X } from 'lucide-react'
import { useCallback } from 'react'

interface CategoryFiltersProps {
  categorySlug: string
  uniqueCities: string[]
  cityCounts: Record<string, number>
  ratingCounts: {
    '4.5': number
    '4.0': number
    '3.5': number
    '3.0': number
  }
  totalBusinesses: number
  selectedCity: string
  selectedRating: string
  sortBy: string
}

export default function CategoryFilters({
  categorySlug,
  uniqueCities,
  cityCounts,
  ratingCounts,
  totalBusinesses,
  selectedCity,
  selectedRating,
  sortBy,
}: CategoryFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Helper to update URL params
  const updateFilters = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'all') {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    const queryString = params.toString()
    const url = `${pathname}${queryString ? `?${queryString}` : ''}`
    router.push(url)
  }, [pathname, router, searchParams])

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters('city', e.target.value)
  }

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters('rating', e.target.value)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilters('sort', e.target.value)
  }

  const clearAllFilters = () => {
    router.push(pathname)
  }

  const clearFilter = (key: string) => {
    updateFilters(key, 'all')
  }

  const hasActiveFilters = selectedCity !== 'all' || selectedRating !== 'all' || sortBy !== 'rating-desc'

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} />
          <h3 className="font-bold text-lg">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearAllFilters}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <X size={14} />
            Reset All
          </button>
        )}
      </div>
      
      <div className="space-y-4">
        {/* City Filter */}
        <div>
          <label className="font-medium mb-2 block">City</label>
          <select 
            value={selectedCity}
            onChange={handleCityChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Cities ({totalBusinesses})</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>
                {city} ({cityCounts[city] || 0})
              </option>
            ))}
          </select>
        </div>
        
        {/* Rating Filter */}
        <div>
          <label className="font-medium mb-2 block">Minimum Rating</label>
          <select 
            value={selectedRating}
            onChange={handleRatingChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5+ Stars ({ratingCounts['4.5']})</option>
            <option value="4.0">4.0+ Stars ({ratingCounts['4.0']})</option>
            <option value="3.5">3.5+ Stars ({ratingCounts['3.5']})</option>
            <option value="3.0">3.0+ Stars ({ratingCounts['3.0']})</option>
          </select>
        </div>
        
        {/* Sort By */}
        <div>
          <label className="font-medium mb-2 block">Sort By</label>
          <select 
            value={sortBy}
            onChange={handleSortChange}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="rating-desc">Highest Rated</option>
            <option value="rating-asc">Lowest Rated</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-gray-500 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCity !== 'all' && (
              <button 
                onClick={() => clearFilter('city')}
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs hover:bg-green-200"
              >
                {selectedCity}
                <X size={12} />
              </button>
            )}
            {selectedRating !== 'all' && (
              <button 
                onClick={() => clearFilter('rating')}
                className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs hover:bg-green-200"
              >
                {selectedRating}+ Stars
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}