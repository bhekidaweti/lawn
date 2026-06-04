import { createClient } from '@/utils/supabase/server'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = 'https://www.lawnmowingnearme.org'
  
  // Fetch all businesses
  const { data: businesses, error: businessError } = await supabase
    .from('businesses')
    .select('slug, updated_at, created_at')
    .not('slug', 'is', null)
  
  // Debug logging
  console.log('=== SITEMAP DEBUG ===')
  console.log('Businesses fetched:', businesses?.length || 0)
  if (businessError) console.error('Business error:', businessError)
  
  if (businesses && businesses.length > 0) {
    console.log('First 3 business slugs:', businesses.slice(0, 3).map(b => b.slug))
  }
  
  // Fetch all categories
  const { data: categories, error: categoryError } = await supabase
    .from('categories')
    .select('slug')
    .not('slug', 'is', null)
  
  console.log('Categories fetched:', categories?.length || 0)
  
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
      url: `${baseUrl}/near-me`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  // Dynamic routes for businesses
  const businessRoutes = businesses?.map((business) => ({
    url: `${baseUrl}/listings/${business.slug}`,
    lastModified: new Date(business.updated_at || business.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  })) || []
  
  console.log('Business routes generated:', businessRoutes.length)
  
  // Dynamic routes for categories
  const categoryRoutes = categories?.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  })) || []
  
  // Get unique countries
  const { data: countryData } = await supabase
    .from('businesses')
    .select('country')
    .not('country', 'is', null)
  
  const uniqueCountries = [...new Set(countryData?.map(c => c.country) || [])]
  console.log('Unique countries:', uniqueCountries.length)
  
  const countryRoutes = uniqueCountries.map((country) => ({
    url: `${baseUrl}/countries/${encodeURIComponent(country.toLowerCase().replace(/ /g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // Get unique cities
  const { data: cityData } = await supabase
    .from('businesses')
    .select('city, country')
    .not('city', 'is', null)
  
  const uniqueCities = [...new Map(
    cityData?.map(c => [`${c.city}-${c.country}`, { city: c.city, country: c.country }]) || []
  ).values()]
  
  console.log('Unique cities:', uniqueCities.length)
  
  const cityRoutes = uniqueCities.map(({ city, country }) => ({
    url: `${baseUrl}/near-me/${encodeURIComponent(city.toLowerCase().replace(/ /g, '-'))}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Service + city combinations
  const services = [
    'grass-cutting-service', 'lawn-fertilization', 'landscape-architect', 
    'irrigation-installation', 'lawn-maintenance', 'landscaping', 
    'garden-care', 'hedge-trimming', 'canberra-gardens', 
    'evergreen-eco-gardening', 'lawn-mowing-service', 'lawn-care', 
    'lawn-treatment', 'mulching-services', 'tree-service-landscaping', 
    'yard-care-service'
  ]
  
  const popularCities = uniqueCities.slice(0, 20)
  const serviceCityRoutes = popularCities.flatMap(({ city }) =>
    services.map((service) => ({
      url: `${baseUrl}/services/${service}/${encodeURIComponent(city.toLowerCase().replace(/ /g, '-'))}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))
  )
  
  const allRoutes = [
    ...staticRoutes,
    ...businessRoutes,
    ...categoryRoutes,
    ...countryRoutes,
    ...cityRoutes,
    ...serviceCityRoutes,
  ]
  
  console.log('TOTAL SITEMAP URLS:', allRoutes.length)
  console.log('=== END DEBUG ===')
  
  return allRoutes
}