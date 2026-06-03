'use client'

import { Navigation, MapPin } from 'lucide-react'

interface MapProps {
  businessName: string
  address: string
  city: string
  state: string
  country: string
}

export default function Map({ businessName, address, city, state, country }: MapProps) {
  // Build the map query from business data
  const mapQuery = encodeURIComponent(
    `${businessName}, ${address}, ${city}, ${state}, ${country}`
  )
  
  // Google Maps embed URL
  const googleMapsUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`
  
  // Directions URL for the button
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`

  const handleGetDirections = () => {
    window.open(directionsUrl, '_blank')
  }

  // If no address, show fallback
  if (!address || !city) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="bg-gray-100 h-64 rounded-lg flex flex-col items-center justify-center">
          <MapPin size={32} className="text-gray-400 mb-2" />
          <span className="text-gray-500 text-sm">Address not available</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="rounded-lg overflow-hidden h-64">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src={googleMapsUrl}
          title={`Map of ${businessName}`}
        />
      </div>
      <button 
        onClick={handleGetDirections}
        className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <Navigation size={18} />
        Get Directions
      </button>
    </div>
  )
}