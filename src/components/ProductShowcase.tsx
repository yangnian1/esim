// 服务端渲染版本 - 完全移除客户端逻辑
import Link from 'next/link'
import Image from 'next/image'
import { apiUtils } from '@/lib/api'
import { Product, Category } from '@/types'
import { MapPin, Map, Globe } from 'lucide-react'

interface ProductShowcaseProps {
  products: Product[]
  lng: string
  // 服务端预取的分类数据
  serverCategories?: Category[]
  serverLocalEsimSubCategories?: Category[]
  serverRegionalEsimSubCategories?: Category[]
  serverCategoryProducts?: Record<number, Product[]>
  // 新增：当前选中的tab和分类
  activeTab?: 'local' | 'regional' | 'global'
  selectedCategoryId?: number
  selectedSubCategoryId?: number
}

export function ProductShowcase({ 
  products: initialProducts, 
  lng,
  serverCategories = [],
  serverLocalEsimSubCategories = [],
  serverRegionalEsimSubCategories = [],
  serverCategoryProducts = {},
  activeTab = 'local',
  selectedCategoryId,
  selectedSubCategoryId
}: ProductShowcaseProps) {
  
  const tabs = [
    { 
      id: 'local' as const, 
      name: lng === 'zh' ? '本地 eSIM' : 'Local eSIM', 
      icon: <MapPin className="w-4 h-4" />,
      href: `/${lng}?tab=local`
    },
    { 
      id: 'regional' as const, 
      name: lng === 'zh' ? '区域 eSIM' : 'Regional eSIM', 
      icon: <Map className="w-4 h-4" />,
      href: `/${lng}?tab=regional`
    },
    { 
      id: 'global' as const, 
      name: lng === 'zh' ? '全球 eSIM' : 'Global eSIM', 
      icon: <Globe className="w-4 h-4" />,
      href: `/${lng}?tab=global`
    }
  ]

  // 获取当前分类数据
  const getCurrentCategories = () => {
    switch (activeTab) {
      case 'local':
        return serverLocalEsimSubCategories
      case 'regional':
        return serverRegionalEsimSubCategories
      case 'global':
        return serverCategories.filter(cat => cat.name?.includes('全球') || cat.name?.toLowerCase().includes('global'))
      default:
        return serverLocalEsimSubCategories
    }
  }

  const currentCategories = getCurrentCategories()
  const selectedCategory = currentCategories.find(cat => cat.id === selectedCategoryId)
  const selectedSubCategory = selectedCategory?.children?.find(cat => cat.id === selectedSubCategoryId)

  // 获取当前显示的产品
  const getCurrentProducts = () => {
    if (selectedSubCategoryId && serverCategoryProducts[selectedSubCategoryId]) {
      return serverCategoryProducts[selectedSubCategoryId]
    }
    if (selectedCategoryId && serverCategoryProducts[selectedCategoryId]) {
      return serverCategoryProducts[selectedCategoryId]
    }
    return initialProducts.slice(0, 8) // 默认显示前8个产品
  }

  const currentProducts = getCurrentProducts()

  // 渲染产品卡片
  const renderProductCard = (product: Product) => (
    <Link
      key={product.id}
      href={`/${lng}/products/${product.id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow block"
    >
      <div className="relative w-full h-48">
        <Image
          src={product.image?.url ? apiUtils.getImageUrl(product.image.url) : '/placeholder.png'}
          alt={product.image?.alternativeText || product.name || product.title || ''}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        {product.featured && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            {lng === 'zh' ? '推荐' : 'Featured'}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.name || product.title}
        </h3>
        
        {(product.short_description || product.description) && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.short_description || product.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            {(product.price || product.original_price) && (
              <p className="text-xl font-bold text-blue-600">
                {apiUtils.formatPrice(product.price || product.original_price, product.currency || 'CNY')}
              </p>
            )}
          </div>
          
          <span className="text-blue-600 text-sm font-medium">
            {lng === 'zh' ? '查看详情 →' : 'View Details →'}
          </span>
        </div>
      </div>
    </Link>
  )

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {lng === 'zh' ? '探索我们的 eSIM 套餐' : 'Explore Our eSIM Plans'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {lng === 'zh' 
              ? '为您的旅行选择最适合的 eSIM 套餐，享受无缝的全球连接体验。' 
              : 'Choose the perfect eSIM plan for your travels and enjoy seamless global connectivity.'}
          </p>
        </div>

        {/* Tab 导航 - 服务端渲染版本 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`flex items-center px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.icon}
                <span className="ml-2">{tab.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 面包屑导航 */}
        {(selectedCategory || selectedSubCategory) && (
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href={`/${lng}?tab=${activeTab}`} className="hover:text-blue-600">
                {tabs.find(t => t.id === activeTab)?.name}
              </Link>
              {selectedCategory && (
                <>
                  <span>→</span>
                  <Link 
                    href={`/${lng}?tab=${activeTab}&category=${selectedCategory.id}`}
                    className="hover:text-blue-600"
                  >
                    {selectedCategory.name}
                  </Link>
                </>
              )}
              {selectedSubCategory && (
                <>
                  <span>→</span>
                  <span className="text-gray-900 font-medium">
                    {selectedSubCategory.name}
                  </span>
                </>
              )}
            </nav>
          </div>
        )}

        {/* 内容区域 */}
        {!selectedCategoryId ? (
          /* 显示分类列表 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCategories.map((category) => (
              <Link
                key={category.id}
                href={`/${lng}?tab=${activeTab}&category=${category.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block text-center"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  {category.attributes?.product_count && (
                    <p className="text-gray-600 text-sm">
                      {category.attributes.product_count} {lng === 'zh' ? '个套餐' : 'plans'}
                    </p>
                  )}
                </div>
                <div className="text-blue-600 font-medium">
                  {lng === 'zh' ? '查看套餐 →' : 'View Plans →'}
                </div>
              </Link>
            ))}
          </div>
        ) : !selectedSubCategoryId && selectedCategory?.children && selectedCategory.children.length > 0 ? (
          /* 显示子分类列表 */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedCategory.children.map((subCategory) => (
              <Link
                key={subCategory.id}
                href={`/${lng}?tab=${activeTab}&category=${selectedCategoryId}&subcategory=${subCategory.id}`}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow block text-center"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {subCategory.name}
                  </h3>
                  {subCategory.attributes?.product_count && (
                    <p className="text-gray-600 text-sm">
                      {subCategory.attributes.product_count} {lng === 'zh' ? '个套餐' : 'plans'}
                    </p>
                  )}
                </div>
                <div className="text-blue-600 font-medium">
                  {lng === 'zh' ? '查看套餐 →' : 'View Plans →'}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* 显示产品列表 */
          <div>
            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentProducts.map(renderProductCard)}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {lng === 'zh' ? '暂无产品数据' : 'No products available'}
                </p>
              </div>
            )}

            {currentProducts.length > 0 && (
              <div className="text-center mt-8">
                <Link
                  href={`/${lng}/products?category=${selectedSubCategoryId || selectedCategoryId}`}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {lng === 'zh' ? '查看全部产品' : 'View All Products'}
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
} 