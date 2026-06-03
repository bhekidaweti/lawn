import { createClient } from '@/utils/supabase/server'
import SearchBar from '@/components/Searchbar'
import ListingCard from '@/components/ListingCard'
import Link from 'next/link'
import { Wrench, Star, TrendingUp, Award } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .limit(8)
  
  const { data: topBusinesses } = await supabase
    .from('businesses')
    .select('*')
    .order('rating', { ascending: false })
    .limit(6)
  
  const { data: recentListings } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4 text-center">
              Find the Best Lawn Mower Services Near You
            </h1>
            <p className="text-xl mb-8 text-center">
              Connect with trusted lawn mower repair, sales, and maintenance professionals
            </p>
            <SearchBar variant="hero" />
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <Link href="/categories" className="text-green-600 hover:underline">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition text-center group"
              >
                <Wrench className="mx-auto mb-3 text-green-600 group-hover:scale-110 transition" size={32} />
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Top Rated Services</h2>
              <div className="flex items-center gap-2 text-green-600">
                <Star size={20} fill="currentColor" />
                <span>Based on Google reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topBusinesses?.map((business) => (
                <ListingCard key={business.id} business={business} variant="default" />
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings Section */}
        <section className="py-16 container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Recently Added</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp size={20} />
              <span>Fresh listings</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings?.map((business) => (
              <ListingCard key={business.id} business={business} variant="compact" />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-green-700 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <Award size={48} className="mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Own a Lawn Mower Business?</h2>
            <p className="text-xl mb-6">List your business for free and reach more customers</p>
            <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started Today
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}