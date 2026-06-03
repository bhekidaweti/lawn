import Link from 'next/link'
import { Wrench, Calendar, Scissors, Truck, Shield, Settings, Search } from 'lucide-react'

const services = [
  {
    slug: 'repair',
    title: 'Lawn Mower Repair',
    description: 'Expert repair services for all makes and models',
    icon: Wrench,
    color: 'bg-blue-500',
    cities: ['Los Angeles', 'San Diego', 'San Francisco', 'Sacramento']
  },
  {
    slug: 'maintenance',
    title: 'Maintenance & Tune-Up',
    description: 'Regular maintenance to keep your mower running smoothly',
    icon: Settings,
    color: 'bg-green-500',
    cities: ['Los Angeles', 'San Diego', 'San Francisco']
  },
  {
    slug: 'sharpening',
    title: 'Blade Sharpening',
    description: 'Professional blade sharpening for a perfect cut',
    icon: Scissors,
    color: 'bg-yellow-500',
    cities: ['Los Angeles', 'San Diego', 'San Francisco', 'Sacramento']
  },
  {
    slug: 'sales',
    title: 'New & Used Sales',
    description: 'Quality lawn mowers from top brands',
    icon: Truck,
    color: 'bg-purple-500',
    cities: ['Los Angeles', 'San Diego']
  },
  {
    slug: 'parts',
    title: 'Parts & Accessories',
    description: 'Genuine parts and accessories in stock',
    icon: Shield,
    color: 'bg-red-500',
    cities: ['Los Angeles', 'San Francisco']
  }
]

export default function ServicesIndexPage() {
  return (
    <>
      <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Lawn Mower Services</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Find professional lawn mower services near you. Browse by service type and location.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className={`${service.color} p-4 text-white`}>
                  <Icon size={32} />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Available in:</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.cities.map(city => (
                        <Link 
                          key={city}
                          href={`/services/${service.slug}/${city.toLowerCase().replace(/ /g, '-')}`}
                          className="text-sm bg-gray-100 px-3 py-1 rounded-full hover:bg-purple-100 hover:text-purple-600 transition"
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all"
                  >
                    Browse Services →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Popular Cities */}
        <div className="mt-16 bg-gray-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Popular Locations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/near-me/Los%20Angeles" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
              <div className="font-semibold">Los Angeles, CA</div>
              <div className="text-sm text-gray-500">24 services</div>
            </Link>
            <Link href="/near-me/San%20Diego" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
              <div className="font-semibold">San Diego, CA</div>
              <div className="text-sm text-gray-500">18 services</div>
            </Link>
            <Link href="/near-me/San%20Francisco" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
              <div className="font-semibold">San Francisco, CA</div>
              <div className="text-sm text-gray-500">15 services</div>
            </Link>
            <Link href="/near-me/Sacramento" className="bg-white p-4 rounded-lg text-center hover:shadow-md transition">
              <div className="font-semibold">Sacramento, CA</div>
              <div className="text-sm text-gray-500">9 services</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}