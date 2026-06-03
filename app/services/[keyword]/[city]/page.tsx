import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SearchBar, ListingCard } from '@/components'
import { Wrench, Filter, Star, TrendingUp, Clock, Shield, Truck, Calendar } from 'lucide-react'

interface PageProps {
  params: Promise<{ keyword: string; city: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Helper function to decode URL parameters
function decodeParam(param: string): string {
  return decodeURIComponent(param).replace(/-/g, ' ')
}

// Service keyword mappings
const serviceKeywords: Record<string, { title: string; description: string; icon: any }> = {
  'repair': {
    title: 'Lawn Mower Repair',
    description: 'Professional repair services for all lawn mower brands and models',
    icon: Wrench
  },
  'maintenance': {
    title: 'Lawn Mower Maintenance',
    description: 'Regular maintenance and tune-up services to keep your mower running smoothly',
    icon: Calendar
  },
  'sharpening': {
    title: 'Blade Sharpening',
    description: 'Professional blade sharpening for a perfect cut every time',
    icon: TrendingUp
  },
  'sales': {
    title: 'Lawn Mower Sales',
    description: 'New and used lawn mowers from top brands at competitive prices',
    icon: Truck
  },
  'parts': {
    title: 'Parts & Accessories',
    description: 'Genuine parts and accessories for all lawn mower models',
    icon: Shield
  }
}

export default async function ServicesPage({ params, searchParams }: PageProps) {
  const { keyword: keywordSlug, city: citySlug } = await params
  const resolvedSearchParams = await searchParams
  
  const keyword = decodeParam(keywordSlug)
  const city = decodeParam(citySlug)
  
  const supabase = await createClient()
  
  // Get service info
  const serviceInfo = serviceKeywords[keyword.toLowerCase()] || {
    title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Services`,
    description: `Professional ${keyword} services for your lawn mower needs`,
    icon: Wrench
  }
  
  // Build search query
  let query = supabase
    .from('businesses')
    .select('*')
    .eq('city', city)
  
  // Search by keyword in name, category, or description
  const { data: allBusinesses } = await query
  
  const businesses = allBusinesses?.filter(business => {
    const searchableText = `${business.name} ${business.category} ${business.description} ${business.services}`.toLowerCase()
    return searchableText.includes(keyword.toLowerCase())
  })
  
  // Apply additional filters
  const rating = resolvedSearchParams.rating as string
  let filteredBusinesses = businesses || []
  
  if (rating && filteredBusinesses) {
    const minRating = parseFloat(rating)
    filteredBusinesses = filteredBusinesses.filter(b => 
      b.rating && parseFloat(b.rating) >= minRating
    )
  }
  
  // Sort results
  const sortBy = resolvedSearchParams.sort as string || 'relevance'
  switch (sortBy) {
    case 'rating':
      filteredBusinesses.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'))
      break
    case 'price':
      // Assuming you have a price field - sort by price low to high
      filteredBusinesses.sort((a, b) => (a.price || 0) - (b.price || 0))
      break
    case 'relevance':
    default:
      // Keep as is (most relevant)
      break
  }
  
  // Check if we have results
  if (filteredBusinesses.length === 0) {
    notFound()
  }
  
  const ServiceIcon = serviceInfo.icon

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/" className="text-white/80 hover:text-white">Home</Link>
            <span>›</span>
            <Link href="/services" className="text-white/80 hover:text-white">Services</Link>
            <span>›</span>
            <span className="text-white/80">{keyword}</span>
            <span>›</span>
            <span className="font-semibold">{city}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <ServiceIcon size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{serviceInfo.title} in {city}</h1>
                <p className="text-xl text-white/90">{serviceInfo.description}</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{filteredBusinesses.length}</div>
              <div className="text-sm">Available Services</div>
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
                <h3 className="font-bold text-lg">Filter Results</h3>
              </div>
              
              <form className="space-y-6">
                {/* Rating Filter */}
                <div>
                  <label className="font-medium mb-2 block">Minimum Rating</label>
                  <select 
                    name="rating"
                    defaultValue={rating || ''}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3">3.0+ Stars</option>
                  </select>
                </div>
                
                {/* Sort By */}
                <div>
                  <label className="font-medium mb-2 block">Sort By</label>
                  <select 
                    name="sort"
                    defaultValue={sortBy}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price">Price: Low to High</option>
                  </select>
                </div>
                
                {/* Price Range (optional - add if you have price data) */}
                <div>
                  <label className="font-medium mb-2 block">Price Range</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" /> Under $50
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" /> $50 - $100
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" /> $100 - $200
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" /> $200+
                    </label>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Apply Filters
                </button>
                
                <Link 
                  href={`/services/${keywordSlug}/${citySlug}`}
                  className="block text-center text-sm text-gray-500 hover:text-purple-600"
                >
                  Reset Filters
                </Link>
              </form>
            </div>
            
            {/* Tips Card */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mt-6">
              <h3 className="font-bold text-lg mb-3">💡 Tips for Choosing a Service</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Star size={16} className="text-purple-600 mt-0.5" />
                  <span>Check customer reviews and ratings</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock size={16} className="text-purple-600 mt-0.5" />
                  <span>Ask about warranties and guarantees</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield size={16} className="text-purple-600 mt-0.5" />
                  <span>Verify licenses and insurance</span>
                </li>
                <li className="flex items-start gap-2">
                  <Truck size={16} className="text-purple-600 mt-0.5" />
                  <span>Compare multiple quotes before deciding</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar 
                variant="compact" 
                placeholder={`Search for ${keyword} services in ${city}...`}
              />
            </div>
            
            {/* Results Summary */}
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-gray-600">
                Found <span className="font-semibold text-purple-600">{filteredBusinesses.length}</span> {keyword} services in {city}
              </p>
            </div>
            
            {/* Business Listings */}
            <div className="space-y-4">
              {filteredBusinesses.map((business) => (
                <div key={business.id} className="relative">
                  <ListingCard business={business} variant="default" />
                  {/* Service badge */}
                  <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    {keyword}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Related Services Section */}
      <section className="bg-gray-100 py-12 mt-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Related Services in {city}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.keys(serviceKeywords)
              .filter(k => k !== keyword.toLowerCase())
              .slice(0, 3)
              .map(service => {
                const ServiceIconComponent = serviceKeywords[service].icon
                return (
                  <Link 
                    key={service}
                    href={`/services/${service}/${citySlug}`}
                    className="bg-white p-4 rounded-lg hover:shadow-md transition group"
                  >
                    <div className="flex items-center gap-3">
                      <ServiceIconComponent size={24} className="text-purple-600" />
                      <div>
                        <div className="font-semibold group-hover:text-purple-600">
                          {serviceKeywords[service].title}
                        </div>
                        <div className="text-sm text-gray-500">in {city}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        </div>
      </section>
    </>
  )
}