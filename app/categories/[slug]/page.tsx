import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ListingCard from '@/components/ListingCard'
import SearchBar from '@/components/Searchbar'
import CategoryFilters from '@/components/CategoryFilters'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper to safely parse rating from text
function parseRating(rating: string | null): number {
  if (!rating) return 0
  const parsed = parseFloat(rating)
  return isNaN(parsed) ? 0 : parsed
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  
  const supabase = await createClient()
  
  // Get category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (!category) {
    notFound()
  }
  
  // Get filter values from URL
  const selectedCity = (resolvedSearchParams.city as string) || 'all'
  const selectedRating = (resolvedSearchParams.rating as string) || 'all'
  const sortBy = (resolvedSearchParams.sort as string) || 'rating-desc'
  
  // Build the query
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('category', category.name)
  
  // Apply city filter
  if (selectedCity && selectedCity !== 'all') {
    query = query.eq('city', selectedCity)
  }
  
  // Execute query
  let { data: businesses } = await query
  
  // Apply rating filter (client-side since rating is text in DB)
  if (businesses && selectedRating !== 'all') {
    const minRating = parseFloat(selectedRating)
    businesses = businesses.filter(business => {
      const rating = parseRating(business.rating)
      return rating >= minRating
    })
  }
  
  // Apply sorting
  if (businesses) {
    switch (sortBy) {
      case 'rating-desc':
        businesses.sort((a, b) => parseRating(b.rating) - parseRating(a.rating))
        break
      case 'rating-asc':
        businesses.sort((a, b) => parseRating(a.rating) - parseRating(b.rating))
        break
      case 'name-asc':
        businesses.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        break
      case 'name-desc':
        businesses.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
        break
      case 'recent':
        businesses.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
      default:
        businesses.sort((a, b) => parseRating(b.rating) - parseRating(a.rating))
    }
  }
  
  // Get unique cities for this category from the database
  const { data: cityData } = await supabase
    .from('businesses')
    .select('city')
    .eq('category', category.name)
    .not('city', 'is', null)
    .neq('city', '')
  
  const uniqueCities = [...new Set(cityData?.map(c => c.city).filter(Boolean) || [])]
  
  // Calculate city counts
  const cityCounts: Record<string, number> = {}
  uniqueCities.forEach(city => {
    cityCounts[city] = businesses?.filter(b => b.city === city).length || 0
  })
  
  // Calculate rating distribution
  const ratingCounts = {
    '4.5': 0,
    '4.0': 0,
    '3.5': 0,
    '3.0': 0,
  }
  
  businesses?.forEach(business => {
    const rating = parseRating(business.rating)
    if (rating >= 4.5) ratingCounts['4.5']++
    else if (rating >= 4.0) ratingCounts['4.0']++
    else if (rating >= 3.5) ratingCounts['3.5']++
    else if (rating >= 3.0) ratingCounts['3.0']++
  })

  const hasActiveFilters = selectedCity !== 'all' || selectedRating !== 'all' || sortBy !== 'rating-desc'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Link href="/categories" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeft size={20} />
              Back to Categories
            </Link>
            <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl mb-4">
              Find the best lawn mower {category.name.toLowerCase()} services near you
            </p>
            <div className="max-w-2xl">
              <SearchBar variant="compact" placeholder={`Search ${category.name} services...`} />
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Now a Client Component */}
            <div className="lg:w-1/4">
              <CategoryFilters
                categorySlug={slug}
                uniqueCities={uniqueCities}
                cityCounts={cityCounts}
                ratingCounts={ratingCounts}
                totalBusinesses={businesses?.length || 0}
                selectedCity={selectedCity}
                selectedRating={selectedRating}
                sortBy={sortBy}
              />
            </div>

            {/* Business Listings */}
            <div className="lg:w-3/4">
              <div className="mb-4 flex flex-wrap justify-between items-center gap-2">
                <p className="text-gray-600">
                  Found <span className="font-semibold text-green-600">{businesses?.length || 0}</span> businesses
                  {selectedCity !== 'all' && <span> in <span className="font-semibold">{selectedCity}</span></span>}
                </p>
                {hasActiveFilters && (
                  <Link 
                    href={`/categories/${slug}`}
                    className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1"
                  >
                    Clear all filters
                  </Link>
                )}
              </div>
              
              <div className="space-y-4">
                {businesses && businesses.length > 0 ? (
                  businesses.map((business) => (
                    <ListingCard key={business.id} business={business} variant="default" />
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-500">No businesses found matching your filters.</p>
                    <Link 
                      href={`/categories/${slug}`}
                      className="inline-block mt-4 text-green-600 hover:underline"
                    >
                      Clear all filters
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 