import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ListingCard from '@/components/ListingCard'
import SearchBar from '@/components/Searchbar'
import { ArrowLeft, Filter } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (!category) {
    notFound()
  }
  
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', category.name)
    .order('rating', { ascending: false })

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
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter size={20} />
                  <h3 className="font-bold text-lg">Filters</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="font-medium mb-2 block">City</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>All Cities</option>
                      <option>Los Angeles</option>
                      <option>San Diego</option>
                      <option>San Francisco</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="font-medium mb-2 block">Rating</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>All Ratings</option>
                      <option>4+ Stars</option>
                      <option>3+ Stars</option>
                      <option>2+ Stars</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="font-medium mb-2 block">Sort By</label>
                    <select className="w-full p-2 border rounded-lg">
                      <option>Rating (Highest)</option>
                      <option>Rating (Lowest)</option>
                      <option>Name A-Z</option>
                      <option>Recently Added</option>
                    </select>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                  Apply Filters
                </button>
              </div>
            </div>

            {/* Business Listings */}
            <div className="lg:w-3/4">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">{businesses?.length || 0} businesses found</p>
                <button className="text-green-600 hover:underline text-sm">Reset filters</button>
              </div>
              
              <div className="space-y-4">
                {businesses?.map((business) => (
                  <ListingCard key={business.id} business={business} variant="default" />
                ))}
                
                {businesses?.length === 0 && (
                  <div className="bg-white rounded-lg p-12 text-center">
                    <p className="text-gray-500">No businesses found in this category yet.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back soon!</p>
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