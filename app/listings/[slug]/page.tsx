import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, MapPin, Phone, Globe, Clock, Share2, Bookmark } from 'lucide-react'
import MapWrapper from '@/components/MapWrapper'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ListingPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single()
  
  if (!business) {
    notFound()
  }
  
  // Get similar businesses
  const { data: similar } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', business.category)
    .neq('id', business.id)
    .limit(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-green-600">Home</Link> › 
          <Link href="/categories" className="hover:text-green-600"> Categories</Link> › 
          <Link href={`/categories/${business.category?.toLowerCase().replace(/ /g, '-')}`} className="hover:text-green-600">
            {business.category}
          </Link> › 
          <span className="text-gray-700">{business.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{business.name}</h1>
                  {business.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="text-yellow-500" fill="currentColor" size={20} />
                        <span className="font-bold text-lg">{business.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">24 Google reviews</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <Bookmark size={20} />
                  </button>
                  <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {business.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="text-gray-500 mt-1" size={18} />
                      <div>
                        <div>{business.address}</div>
                        <div>{business.city}, {business.state} {business.country}</div>
                      </div>
                    </div>
                  )}
                  {business.phone && (
                    <div className="flex items-center gap-3">
                      <Phone size={18} className="text-gray-500" />
                      <a href={`tel:${business.phone}`} className="text-green-600 hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  )}
                  {business.website && (
                    <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-500" />
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                        {business.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {business.description && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3">About {business.name}</h3>
                  <p className="text-gray-600 leading-relaxed">{business.description}</p>
                </div>
              )}

              {/* Business Hours */}
              <div>
                <h3 className="font-bold text-lg mb-3">Typical Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Map */}
          <div className="lg:w-1/3">
            <MapWrapper
              businessName={business.name}
              address={business.address || ''}
              city={business.city || ''}
              state={business.state || ''}
              country={business.country || 'USA'}
            />

            {/* Similar Businesses */}
            {similar && similar.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="font-bold text-lg mb-4">Similar Businesses</h3>
                <div className="space-y-4">
                  {similar.map((biz) => (
                    <Link key={biz.id} href={`/listings/${biz.slug}`}>
                      <div className="hover:bg-gray-50 p-3 rounded-lg transition cursor-pointer">
                        <h4 className="font-semibold text-green-600">{biz.name}</h4>
                        {biz.city && (
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <MapPin size={12} />
                            <span>{biz.city}, {biz.state}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}