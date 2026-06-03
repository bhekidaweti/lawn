import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.lawnmowingnearme.org' 
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',        // Don't index API routes
        '/admin/',      // Don't index admin pages
        '/debug/',      // Don't index debug pages
        '/_next/',      // Don't index Next.js internal files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}