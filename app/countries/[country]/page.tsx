import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MapPin, Star, Building, Award, ArrowLeft, AlertCircle } from 'lucide-react'

interface PageProps {
  params: Promise<{ country: string }>
}

interface CityData {
  name: string
  state: string | null
  businessCount: number
  avgRating: number
}

function decodeCountry(countrySlug: string): string {
  return decodeURIComponent(countrySlug).replace(/-/g, ' ')
}

// Helper function to match country names (case-insensitive with variations)
function matchCountryName(urlCountry: string, dbCountry: string): boolean {
  const normalizedUrl = urlCountry.toLowerCase().trim()
  const normalizedDb = dbCountry.toLowerCase().trim()
  
  // Direct match
  if (normalizedUrl === normalizedDb) return true
  
  // Handle common variations
  const variations: Record<string, string[]> = {
    'united states': ['usa', 'us', 'united states of america', 'america'],
    'usa': ['united states', 'us', 'united states of america', 'america'],
    'uk': ['united kingdom', 'great britain', 'england', 'britain'],
    'united kingdom': ['uk', 'great britain', 'england', 'britain'],
    'uae': ['united arab emirates'],
  }
  
  // Check if the URL country matches any variation of the DB country
  for (const [key, aliases] of Object.entries(variations)) {
    if ((normalizedUrl === key || aliases.includes(normalizedUrl)) && 
        (normalizedDb === key || aliases.includes(normalizedDb))) {
      return true
    }
  }
  
  return false
}

// Helper function to safely parse rating from text
function parseRating(rating: string | null): number {
  if (!rating) return 0
  const parsed = parseFloat(rating)
  return isNaN(parsed) ? 0 : parsed
}

export default async function CountryDetailPage({ params }: PageProps) {
  const { country: countrySlug } = await params
  const urlCountryName = decodeCountry(countrySlug)
  const supabase = await createClient()
  
  // First, get all businesses to find matching country
  const { data: allBusinesses, error } = await supabase
    .from('businesses')
    .select('*')
    .not('country', 'is', null)
  
  if (error) {
    console.error('Supabase error:', error)
  }
  
  // Find matching country from database
  let matchedCountry: string | null = null
  let businesses: any[] = []
  
  if (allBusinesses && allBusinesses.length > 0) {
    // Try to find exact match first
    let exactMatch = allBusinesses.find(b => 
      b.country.toLowerCase() === urlCountryName.toLowerCase()
    )
    
    if (exactMatch) {
      matchedCountry = exactMatch.country
      businesses = allBusinesses.filter(b => b.country === matchedCountry)
    } else {
      // Try fuzzy matching
      const matchingBusinesses = allBusinesses.filter(b => 
        matchCountryName(urlCountryName, b.country)
      )
      
      if (matchingBusinesses.length > 0) {
        matchedCountry = matchingBusinesses[0].country
        businesses = matchingBusinesses
      }
    }
  }
  
  // Handle no businesses case
  if (!businesses || businesses.length === 0) {
    // Get all available countries for suggestions
    const availableCountries = [...new Set(allBusinesses?.map(b => b.country) || [])]
    
    return (
      <>
        <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
          <div className="container mx-auto px-4">
            <Link href="/countries" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
              <ArrowLeft size={20} />
              Back to Countries
            </Link>
            
            <div>
              <h1 className="text-4xl font-bold mb-2">Lawn Mower Services in {urlCountryName}</h1>
              <p className="text-xl text-white/90">
                Find trusted professionals across {urlCountryName}
              </p>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-yellow-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Businesses Found Yet</h2>
            <p className="text-gray-600 mb-4">
              We don't have any lawn mower businesses listed in {urlCountryName} yet.
            </p>
            
            {availableCountries.length > 0 && (
              <div className="mt-6">
                <p className="text-gray-600 mb-3">Available countries in our directory:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableCountries.map(country => (
                    <Link
                      key={country}
                      href={`/countries/${country.toLowerCase().replace(/ /g, '-')}`}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
                    >
                      {country}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition">
              Be the First to List Your Business
            </button>
          </div>
        </div>
      </>
    )
  }
  
  // Process cities safely
  const cityMap = new Map<string, CityData>()
  
  businesses.forEach(business => {
    const cityName = business.city
    if (!cityName) return
    
    if (!cityMap.has(cityName)) {
      cityMap.set(cityName, {
        name: cityName,
        state: business.state || null,
        businessCount: 0,
        avgRating: 0
      })
    }
    
    const cityData = cityMap.get(cityName)!
    cityData.businessCount++
    
    const rating = parseRating(business.rating)
    if (rating > 0) {
      ;(cityData as any)._ratingSum = ((cityData as any)._ratingSum || 0) + rating
      ;(cityData as any)._ratingCount = ((cityData as any)._ratingCount || 0) + 1
    }
  })
  
  // Calculate average ratings
  const cities: CityData[] = Array.from(cityMap.values()).map(city => {
    const ratingSum = (city as any)._ratingSum || 0
    const ratingCount = (city as any)._ratingCount || 0
    delete (city as any)._ratingSum
    delete (city as any)._ratingCount
    
    return {
      ...city,
      avgRating: ratingCount > 0 ? ratingSum / ratingCount : 0
    }
  }).sort((a, b) => b.businessCount - a.businessCount)
  
  const totalBusinesses = businesses.length
  
  // Calculate average rating for the country
  let totalRatingSum = 0
  let totalRatingCount = 0
  businesses.forEach(business => {
    const rating = parseRating(business.rating)
    if (rating > 0) {
      totalRatingSum += rating
      totalRatingCount++
    }
  })
  const avgRating = totalRatingCount > 0 ? totalRatingSum / totalRatingCount : 0

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-12">
        <div className="container mx-auto px-4">
          <Link href="/countries" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4">
            <ArrowLeft size={20} />
            Back to Countries
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Lawn Mower Services in {matchedCountry}</h1>
              <p className="text-xl text-white/90">
                Find trusted professionals across {matchedCountry}
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
              <div className="text-3xl font-bold">{totalBusinesses}</div>
              <div className="text-sm">Total Businesses</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Building size={32} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{cities.length}</div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Star size={32} className="mx-auto text-yellow-500 mb-2" />
            <div className="text-2xl font-bold">{avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <Award size={32} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{totalBusinesses}+</div>
            <div className="text-gray-600">Total Listings</div>
          </div>
        </div>

        {/* Cities Grid */}
        {cities.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-8">Cities with Lawn Mower Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link 
                  key={city.name}
                  href={`/near-me/${encodeURIComponent(city.name.replace(/ /g, '-'))}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-green-600 transition">
                        {city.name}
                      </h3>
                      {city.state && (
                        <p className="text-gray-500 text-sm">{city.state}</p>
                      )}
                    </div>
                    <MapPin size={24} className="text-green-600" />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <div className="text-gray-600">
                      {city.businessCount} business{city.businessCount !== 1 ? 'es' : ''}
                    </div>
                    {city.avgRating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span>{city.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Cities Found</h2>
            <p className="text-gray-600">
              We couldn't find any cities with lawn mower services in {matchedCountry}.
            </p>
          </div>
        )}
      </div>
    </>
  )
}