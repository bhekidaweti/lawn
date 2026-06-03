import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Wrench, Scissors, Sprout, Hammer, Settings, Toolbox } from 'lucide-react'

const categoryIcons: Record<string, any> = {
  'repair': Wrench,
  'maintenance': Settings,
  'sales': Hammer,
  'sharpening': Scissors,
  'landscaping': Sprout,
  'parts': Toolbox,
}

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  
  // Get business counts for each category
  const categoriesWithCounts = await Promise.all(
    categories?.map(async (category) => {
      const { count } = await supabase
        .from('businesses')
        .select('*', { count: 'exact', head: true })
        .eq('category', category.name)
      
      return { ...category, count: count || 0 }
    }) || []
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Lawn Mower Service Categories</h1>
          <p className="text-xl">Find specialized services for all your lawn mower needs</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoriesWithCounts.map((category) => {
            const Icon = categoryIcons[category.slug] || Wrench
            return (
              <Link 
                key={category.id}
                href={`/categories/${category.slug}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Icon className="text-green-600 mb-3" size={32} />
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-green-600 transition">
                      {category.name}
                    </h2>
                    <p className="text-gray-600">
                      {category.count} business{category.count !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <div className="text-green-600 group-hover:translate-x-1 transition">
                    →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-16 bg-white rounded-lg p-8 shadow-md">
          <h3 className="text-2xl font-bold mb-4">Why Choose Our Directory?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="font-bold text-3xl text-green-600">500+</div>
              <div className="text-gray-600">Verified Businesses</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-green-600">50+</div>
              <div className="text-gray-600">Cities Covered</div>
            </div>
            <div>
              <div className="font-bold text-3xl text-green-600">1000+</div>
              <div className="text-gray-600">Customer Reviews</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}