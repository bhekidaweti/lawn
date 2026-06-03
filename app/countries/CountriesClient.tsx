'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Search, Star, Building, ChevronRight, Globe } from 'lucide-react'

interface Country {
  name: string
  code: string
  flag: string
  businessCount: number
  avgRating: number
  cities: { name: string; count: number }[]
}

export default function CountriesClient({ initialCountries }: { initialCountries: Country[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const filteredCountries = initialCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedCountryData = initialCountries.find(c => c.name === selectedCountry)

  return (
    <>
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Globe size={48} className="mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">Select Your Country</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find lawn mower services in your country. Choose from our global directory of trusted professionals.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Countries List */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="font-semibold text-lg">Available Countries</h2>
                <p className="text-sm text-gray-500">{filteredCountries.length} countries with lawn mower services</p>
              </div>
              
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {filteredCountries.map((country) => (
                  <button
                    key={country.name}
                    onClick={() => setSelectedCountry(country.name)}
                    className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition flex items-center justify-between ${
                      selectedCountry === country.name ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{country.flag}</span>
                      <div>
                        <div className="font-semibold">{country.name}</div>
                        <div className="text-sm text-gray-500">{country.businessCount} businesses</div>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Country Details */}
          <div className="lg:w-1/2">
            {selectedCountryData ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
                <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCountryData.flag}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedCountryData.name}</h2>
                      <p className="text-white/90">{selectedCountryData.businessCount} total businesses</p>
                      {selectedCountryData.avgRating > 0 && (
                        <div className="flex items-center gap-1 text-sm mt-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span>{selectedCountryData.avgRating.toFixed(1)} average rating</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Building size={20} />
                    Cities with Services
                  </h3>
                  
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedCountryData.cities.length > 0 ? (
                      selectedCountryData.cities
                        .sort((a, b) => b.count - a.count)
                        .map((city) => (
                          <Link
                            key={city.name}
                            href={`/near-me/${encodeURIComponent(city.name.replace(/ /g, '-'))}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group"
                          >
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="font-medium">{city.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500">{city.count} businesses</span>
                              <ChevronRight size={16} className="text-gray-400 group-hover:text-green-600" />
                            </div>
                          </Link>
                        ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">No cities available</p>
                    )}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <Link
                       href={`/countries/${encodeURIComponent(selectedCountryData.name.toLowerCase().replace(/ /g, '-'))}`}
                        className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
                              >
                         Browse All Services in {selectedCountryData.name}
                    </Link>                          
                            
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Globe size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Select a Country</h3>
                <p className="text-gray-500">
                  Choose a country from the list to see available cities and lawn mower services.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}