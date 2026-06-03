import { createClient } from '@/utils/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://www.lawnmowingnearme.org'
  
  // Fetch all businesses
  const { data: businesses } = await supabase
    .from('businesses')
    .select('slug, updated_at, created_at')
    .not('slug', 'is', null)
  
  // Fetch all categories
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .not('slug', 'is', null)
  
  // Get unique countries from businesses
  const { data: countryData } = await supabase
    .from('businesses')
    .select('country')
    .not('country', 'is', null)
  
  const uniqueCountries = [...new Set(countryData?.map(c => c.country) || [])]
  
  // Get unique cities from businesses
  const { data: cityData } = await supabase
    .from('businesses')
    .select('city, country')
    .not('city', 'is', null)
  
  const uniqueCities = [...new Map(
    cityData?.map(c => [`${c.city}-${c.country}`, { city: c.city, country: c.country }]) || []
  ).values()]
  
  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/countries`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/near-me`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]
  
  // Dynamic routes for businesses
  const businessRoutes = businesses?.map((business) => ({
    url: `${baseUrl}/listings/${business.slug}`,
    lastModified: new Date(business.updated_at || business.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []
  
  // Dynamic routes for categories
  const categoryRoutes = categories?.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []
  
  // Dynamic routes for countries
  const countryRoutes = uniqueCountries.map((country) => ({
    url: `${baseUrl}/countries/${encodeURIComponent(country.toLowerCase().replace(/ /g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // Dynamic routes for cities
  const cityRoutes = uniqueCities.map(({ city, country }) => ({
    url: `${baseUrl}/near-me/${encodeURIComponent(city.toLowerCase().replace(/ /g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Service + city combinations (popular combinations)
  const services = ['repair', 'maintenance', 'sharpening', 'sales', 'parts', 'landscaping']
  const popularCities = uniqueCities.slice(0, 20) // Top 20 cities for service pages
  
  const serviceCityRoutes = popularCities.flatMap(({ city }) =>
    services.map((service) => ({
      url: `${baseUrl}/services/${service}/${encodeURIComponent(city.toLowerCase().replace(/ /g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  )
  
  return [
    ...staticRoutes,
    ...businessRoutes,
    ...categoryRoutes,
    ...countryRoutes,
    ...cityRoutes,
    ...serviceCityRoutes,
  ]
}