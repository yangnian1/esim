import Link from 'next/link'
import Image from 'next/image'
import { productsApi, apiUtils } from '@/lib/api'
import { Product } from '@/types'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    products: 'Products',
    back_to_home: 'Back to Home',
    no_products: 'No products available',
    loading_error: 'Failed to load products',
    view_details: 'View Details',
    featured: 'Featured'
  },
  zh: {
    products: '产品',
    back_to_home: '返回首页',
    no_products: '暂无商品数据',
    loading_error: '获取商品数据失败',
    view_details: '查看详情',
    featured: '特色'
  }
}

// SSR缓存配置
export const dynamic = 'force-dynamic' // 确保每次都获取最新数据
// 或者使用以下配置启用缓存：
// export const revalidate = 300 // 5分钟缓存

export default async function Products({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  
  console.log('🛍️ Products 页面开始加载 (SSR模式)，语言:', lng, '时间:', new Date().toISOString())
  
  // 获取商品数据 - SSR模式
  let products: Product[] = []
  let error: string | null = null
  
  try {
    console.log('📦 开始获取商品数据...')
    const response = await productsApi.getList({
      pagination: { page: 1, pageSize: 12 },
      sort: { field: 'original_price', order: 'asc' }
    })
    products = response.data
    console.log('✅ 商品数据获取成功，数量:', products.length)
    console.log('📊 商品数据预览:', products.slice(0, 2)) // 只显示前2个商品
  } catch (err) {
    console.error('❌ 获取商品失败:', err)
    error = t('loading_error')
    
    // SSR模式下的兜底数据
    products = [
      {
        id: 1,
        name: lng === 'zh' ? '日本 eSIM 5GB' : 'Japan eSIM 5GB',
        title: lng === 'zh' ? '日本 eSIM 5GB' : 'Japan eSIM 5GB',
        description: lng === 'zh' ? '日本高速网络，5GB数据流量，有效期7天' : 'Japan high-speed network, 5GB data, valid for 7 days',
        short_description: lng === 'zh' ? '日本7天高速流量' : 'Japan 7-day high-speed',
        price: 19.99,
        original_price: 24.99,
        sale_price: 19.99,
        sku: 'JP-5GB-7D',
        stock: 100,
        brand: 'eSIM Global',
        currency: lng === 'zh' ? '¥' : '$',
        product_status: 'active',
        countries: ['Japan'],
        regions: ['Asia'],
        validity_days: 7,
        featured: true,
        image: {
          url: '/placeholder.png',
          alternativeText: lng === 'zh' ? '日本 eSIM' : 'Japan eSIM'
        },
        publishedAt: new Date().toISOString(),
        locale: lng
      },
      {
        id: 2,
        name: lng === 'zh' ? '韩国 eSIM 8GB' : 'Korea eSIM 8GB',
        title: lng === 'zh' ? '韩国 eSIM 8GB' : 'Korea eSIM 8GB',
        description: lng === 'zh' ? '韩国高速网络，8GB数据流量，有效期10天' : 'Korea high-speed network, 8GB data, valid for 10 days',
        short_description: lng === 'zh' ? '韩国10天高速流量' : 'Korea 10-day high-speed',
        price: 25.99,
        original_price: 29.99,
        sale_price: 25.99,
        sku: 'KR-8GB-10D',
        stock: 120,
        brand: 'eSIM Global',
        currency: lng === 'zh' ? '¥' : '$',
        product_status: 'active',
        countries: ['South Korea'],
        regions: ['Asia'],
        validity_days: 10,
        featured: true,
        image: {
          url: '/placeholder.png',
          alternativeText: lng === 'zh' ? '韩国 eSIM' : 'Korea eSIM'
        },
        publishedAt: new Date().toISOString(),
        locale: lng
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t('products')}</h1>
          <p className="text-gray-600">
            {lng === 'zh' ? '服务端渲染模式' : 'Server-Side Rendered'}
            {' · '}
            <span className="text-sm text-gray-500">
              {new Date().toLocaleString(lng === 'zh' ? 'zh-CN' : 'en-US')}
            </span>
          </p>
        </div>
        
        {error ? (
          <div className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <p className="text-yellow-800 mb-2">⚠️ {error}</p>
              <p className="text-gray-600 text-sm">
                {lng === 'zh' ? '使用兜底数据显示' : 'Showing fallback data'}
              </p>
            </div>
          </div>
        ) : null}
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('no_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              console.log('🏷️ 渲染商品:', product.id, product.title, '价格:', product.original_price, product.sale_price)
              
              return (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {product.image?.url && (
                    <div className="aspect-w-16 aspect-h-9">
                      <Image
                        src={apiUtils.getImageUrl(product.image.url)}
                        alt={product.image.alternativeText || product.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        priority={product.featured} // 特色产品优先加载
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {product.sale_price ? (
                          <>
                            <span className="text-lg font-bold text-red-600">
                              {apiUtils.formatPrice(product.sale_price)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {apiUtils.formatPrice(product.original_price)}
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">
                            {apiUtils.formatPrice(product.original_price)}
                          </span>
                        )}
                      </div>
                      
                      {product.featured && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          {t('featured')}
                        </span>
                      )}
                    </div>
                    
                    {product.category && (
                      <div className="mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {product.category.name}
                        </span>
                      </div>
                    )}
                    
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                      {t('view_details')}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        
        <div className="text-center mt-12">
          <Link
            href={`/${lng}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 transition-colors"
          >
            ← {t('back_to_home')}
          </Link>
        </div>
      </div>
    </main>
  )
} 