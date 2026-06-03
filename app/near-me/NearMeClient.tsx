'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Navigation } from 'lucide-react'

export default function NearMeClient() {
  const [searchCity, setSearchCity] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const saveRecentSearch = (city: string) => {
    const saved = localStorage.getItem('recentCitySearches')
    const recentSearches = saved ? JSON.parse(saved) : []
    const updated = [city, ...recentSearches.filter((c: string) => c !== city)].slice(0, 5)
    localStorage.setItem('recentCitySearches', JSON.stringify(updated))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCity.trim()) {
      saveRecentSearch(searchCity.trim())
      router.push(`/near-me/${encodeURIComponent(searchCity.trim().replace(/ /g, '-'))}`)
    }
  }

  const handleUseCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const city = data.city || data.locality || data.principalSubdivision
            if (city) {
              saveRecentSearch(city)
              router.push(`/near-me/${encodeURIComponent(city.replace(/ /g, '-'))}`)
            }
          } catch (error) {
            console.error('Error getting city name:', error)
            alert('Could not determine your city. Please enter it manually.')
          }
          setLoading(false)
        },
        (error) => {
          console.error('Geolocation error:', error)
          alert('Unable to get your location. Please enter your city manually.')
          setLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Enter your city name (e.g., Los Angeles, Miami, Chicago)"
            className="w-full pl-12 pr-4 py-4 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Search
        </button>
      </form>
      
      <button
        onClick={handleUseCurrentLocation}
        disabled={loading}
        className="mt-4 text-white/90 hover:text-white flex items-center gap-2 mx-auto"
      >
        <Navigation size={18} />
        {loading ? 'Getting your location...' : 'Use my current location'}
      </button>
    </div>
  )
}