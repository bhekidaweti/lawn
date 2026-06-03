import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { SearchBar, ListingCard } from '@/components'
import { MapPin, Filter, Award, Building, PlusCircle, AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ city: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function decodeCity(citySlug: string): string {
  return decodeURIComponent(citySlug).replace(/-/g, ' ')
}

export default async function NearMePage({ params, searchParams }: PageProps) {
  const { city: citySlug } = await params
  const resolvedSearchParams = await searchParams
  const city = decodeCity(citySlug)
  
  const supabase = await createClient()
  
  // Get businesses in this city
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('city', city)
  
  const category = resolvedSearchParams.category as string
  const rating = resolvedSearchParams.rating as string
  const sortBy = resolvedSearchParams.sort as string || 'rating'
  
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  
  let { data: businesses } = await query
  
  if (rating && businesses) {
    const minRating = parseFloat(rating)
    businesses = businesses.filter(b => 
      b.rating && parseFloat(b.rating) >= minRating
    )
  }
  
  if (businesses) {
    switch (sortBy) {
      case 'rating':
        businesses.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
        break
      case 'name':
        businesses.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'recent':
        businesses.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
    }
  }
  
  const categoriesInCity = [...new Set(businesses?.map(b => b.category).filter(Boolean))]
  const totalBusinesses = businesses?.length || 0
  const avgRating = totalBusinesses > 0 ? businesses?.reduce((acc, b) => 
    acc + (b.rating ? parseFloat(b.rating) : 0), 0
  ) / totalBusinesses : 0

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-white/80 hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/countries" className="text-white/80 hover:text-white">Countries</Link>
            <span>›</span>
            <span className="font-semibold">{city}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
                <MapPin size={36} />
                Lawn Mower Services in {city}
              </h1>
              <p className="text-xl text-white/90">
                Find trusted local professionals for all your lawn mower needs
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4">
              <div className="text-3xl font-bold">{totalBusinesses}</div>
              <div className="text-sm">Businesses Found</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                <Filter size={20} />
                <h3 className="font-bold text-lg">Filters</h3>
              </div>
              
              <form className="space-y-6">
                {categoriesInCity.length > 0 && (
                  <div>
                    <label className="font-medium mb-2 block">Category</label>
                    <select 
                      name="category" 
                      defaultValue={category || 'all'}
                      className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gree-500"
                    >
                      <option value="all">All Categories</option>
                      {categoriesInCity.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div>
                  <label className="font-medium mb-2 block">Minimum Rating</label>
                  <select 
                    name="rating"
                    defaultValue={rating || ''}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gree-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3.0+ Stars</option>
                  </select>
                </div>
                
                <div>
                  <label className="font-medium mb-2 block">Sort By</label>
                  <select 
                    name="sort"
                    defaultValue={sortBy}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-gree-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                    <option value="recent">Recently Added</option>
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gree-600 text-white py-2 rounded-lg hover:bg-gree-700 transition"
                >
                  Apply Filters
                </button>
                
                <Link 
                  href={`/near-me/${citySlug}`}
                  className="block text-center text-sm text-gray-500 hover:text-gree-600"
                >
                  Reset Filters
                </Link>
              </form>
            </div>
            
            {totalBusinesses > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Award size={20} />
                  City Stats
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-gree-600">{totalBusinesses}</div>
                    <div className="text-sm text-gray-600">Total Businesses</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gree-600">{avgRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gree-600">{categoriesInCity.length}</div>
                    <div className="text-sm text-gray-600">Categories Available</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <SearchBar variant="compact" placeholder={`Search in ${city}...`} />
            </div>
            
            {totalBusinesses > 0 ? (
              <>
                <div className="bg-white rounded-lg p-4 mb-4 flex flex-wrap justify-between items-center">
                  <div>
                    <p className="text-gray-600">
                      Showing <span className="font-semibold">{businesses?.length || 0}</span> results in {city}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {businesses?.map((business) => (
                    <ListingCard key={business.id} business={business} variant="default" />
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gree-100 rounded-full mb-6">
                  <MapPin size={40} className="text-gree-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">No businesses found in {city}</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any lawn mower services in this area yet. 
                  Be the first to list your business!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-gree-600 text-white px-6 py-3 rounded-lg hover:bg-gree-700 transition flex items-center gap-2 justify-center">
                    <PlusCircle size={20} />
                    Suggest a Business
                  </button>
                  <Link href="/countries" className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 transition">
                    Browse Other Locations
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {totalBusinesses === 0 && (
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Popular Cities Nearby</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/near-me/Los%20Angeles" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
                <div className="font-semibold">Los Angeles</div>
                <div className="text-sm text-gray-500">24 businesses</div>
              </Link>
              <Link href="/near-me/San%20Diego" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
                <div className="font-semibold">San Diego</div>
                <div className="text-sm text-gray-500">18 businesses</div>
              </Link>
              <Link href="/near-me/San%20Francisco" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
                <div className="font-semibold">San Francisco</div>
                <div className="text-sm text-gray-500">15 businesses</div>
              </Link>
              <Link href="/near-me/Sacramento" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
                <div className="font-semibold">Sacramento</div>
                <div className="text-sm text-gray-500">9 businesses</div>
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}