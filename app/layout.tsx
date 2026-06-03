import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar, Footer } from '@/components'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lawn Mower Directory - Find Lawn Mower Services Near You',
  description: 'Connect with trusted lawn mower repair, maintenance, and sales professionals in your area. Read reviews, compare prices, and find the best lawn mower services.',
  keywords: 'lawn mower repair, lawn mower maintenance, lawn mower sales, landscaping services, blade sharpening',
  authors: [{ name: 'LawnMowerDir' }],
  openGraph: {
    title: 'Lawn Mower Directory',
    description: 'Find the best lawn mower services near you',
    url: 'https://lawnmowerdir.com',
    siteName: 'Lawn Mower Directory',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lawn Mower Directory',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lawn Mower Directory',
    description: 'Find the best lawn mower services near you',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
   
      </head>
      <body className={inter.className}>     
        
        {/* Global Navbar */}
        <Navbar />        
        {/* Main content wrapper */}
        <div className="min-h-screen flex flex-col">
          <main id="main-content" className="flex-grow">
            {children}
          </main>          
          {/* Global Footer */}
          <Footer />
        </div>
      </body>
    </html>
  )
}