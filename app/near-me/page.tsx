import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { MapPin, Search, Navigation, Award, Building, Star, TrendingUp, Clock } from 'lucide-react'
import NearMeClient from './NearMeClient'

// This data can be fetched from your database dynamically
async function getPopularCities() {
  const supabase = await createClient()
  
  const { data: businesses } = await supabase
    .from('businesses')
    .select('city, state, rating')
    .not('city', 'is', null)
  
  // Group by city and calculate stats
  const cityMap = new Map()
  
  businesses?.forEach(biz => {
    if (!biz.city) return
    
    if (!cityMap.has(biz.city)) {
      cityMap.set(biz.city, {
        name: biz.city,
        slug: encodeURIComponent(biz.city.replace(/ /g, '-')),
        count: 0,
        ratingSum: 0,
        ratingCount: 0
      })
    }
    
    const city = cityMap.get(biz.city)
    city.count++
    if (biz.rating) {
      city.ratingSum += parseFloat(biz.rating)
      city.ratingCount++
    }
  })
  
  // Calculate average rating and convert to array
  const cities = Array.from(cityMap.values()).map(city => ({
    name: city.name,
    slug: city.slug,
    count: city.count,
    rating: city.ratingCount > 0 ? (city.ratingSum / city.ratingCount).toFixed(1) : 'N/A'
  }))
  
  // Return top 8 cities by business count
  return cities.sort((a, b) => b.count - a.count).slice(0, 8)
}

export default async function NearMePage() {
  const popularCities = await getPopularCities()
  
  return (
    <>
      {/* Hero Section - Static content that doesn't need client interactivity */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <MapPin size={56} className="mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Find Lawn Mower Services Near You</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover trusted lawn mower repair, maintenance, and sales professionals in your local area
          </p>
          
          {/* Client component for interactive search */}
          <NearMeClient />
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Popular Cities - Rendered on server for SEO */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Popular Cities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCities.map((city) => (
              <Link
                key={city.name}
                href={`/near-me/${city.slug}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <MapPin size={32} className="text-blue-600" />
                  {city.rating !== 'N/A' && (
                    <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
                      <Star size={14} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{city.rating}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition">
                  {city.name}
                </h3>
                <div className="text-gray-500 text-sm">
                  {city.count} business{city.count !== 1 ? 'es' : ''}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* How It Works - Static section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">1. Enter Your City</h3>
              <p className="text-gray-500">Type your city name or use your current location</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building size={32} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">2. Browse Services</h3>
              <p className="text-gray-500">Explore local lawn mower businesses near you</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={32} className="text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">3. Choose the Best</h3>
              <p className="text-gray-500">Compare ratings and reviews to find your match</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-12 mt-8">
        <div className="container mx-auto px-4 text-center">
          <Award size={48} className="mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Don't See Your City?</h2>
          <p className="text-xl mb-6">Help us grow our directory by suggesting a business in your area</p>
          <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Suggest a Business
          </button>
        </div>
      </section>
    </>
  )
}