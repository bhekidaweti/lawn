'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'

// Dynamically import the map component with ssr: false
const BusinessMap = dynamic(
  () => import('@/components/Map'),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="bg-gray-100 h-64 rounded-lg flex flex-col items-center justify-center">
          <MapPin size={32} className="text-gray-400 mb-2" />
          <div className="animate-pulse text-gray-400">Loading map...</div>
        </div>
      </div>
    )
  }
)

interface MapWrapperProps {
  businessName: string
  address: string
  city: string
  state: string
  country: string
}

export default function MapWrapper(props: MapWrapperProps) {
  return <BusinessMap {...props} />
}