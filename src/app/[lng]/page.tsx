import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPreview } from '@/components/BlogPreview'
import { productsApi, articlesApi, apiUtils } from '@/lib/api'
import { Product, Article } from '@/types'

// SSR缓存配置
export const dynamic = 'force-dynamic' // 确保每次都获取最新数据
// 或者使用以下配置启用缓存：
// export const revalidate = 600 // 10分钟缓存

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Global eSIM Service',
    subtitle: 'Stay connected worldwide with our reliable eSIM solutions',
    hero_text: 'Welcome to the future of mobile connectivity',
    featured_products: 'Featured Products',
    latest_news: 'Latest News',
    learn_more: 'Learn More',
    view_all_products: 'View All Products',
    view_all_articles: 'View All Articles',
    data_source: 'Data Source',
    server_rendered: 'Server-Side Rendered',
    loading_failed: 'Loading failed',
    using_fallback: 'Using fallback data'
  },
  zh: {
    title: '全球 eSIM 服务',
    subtitle: '使用我们可靠的 eSIM 解决方案保持全球连接',
    hero_text: '欢迎来到移动连接的未来',
    featured_products: '精选产品',
    latest_news: '最新资讯',
    learn_more: '了解更多',
    view_all_products: '查看所有产品',
    view_all_articles: '查看所有文章',
    data_source: '数据来源',
    server_rendered: '服务端渲染',
    loading_failed: '加载失败',
    using_fallback: '使用兜底数据'
  }
}

export default async function Home({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  
  console.log('🏠 首页开始加载 (SSR模式)，语言:', lng, '时间:', new Date().toISOString())
  
  // 并行获取数据 - SSR模式
  const [productsResult, articlesResult] = await Promise.allSettled([
    // 获取精选产品
    (async () => {
      try {
        console.log('📦 开始获取精选产品...')
        const response = await productsApi.getFeatured({
          pagination: { page: 1, pageSize: 6 }
        })
        console.log('✅ 精选产品获取成功，数量:', response.data.length)
        return response.data
      } catch (error) {
        console.error('❌ 获取精选产品失败:', error)
        throw error
      }
    })(),
    
    // 获取最新文章
    (async () => {
      try {
        console.log('📰 开始获取最新文章...')
        const response = await articlesApi.getLatest(lng, 3)
        console.log('✅ 最新文章获取成功，数量:', response.data.length)
        return response.data
      } catch (error) {
        console.error('❌ 获取最新文章失败:', error)
        throw error
      }
    })()
  ])
  
  // 处理产品数据
  let products: Product[] = []
  let productsError = false
  
  if (productsResult.status === 'fulfilled') {
    products = productsResult.value
  } else {
    productsError = true
    console.log('🔄 使用产品兜底数据')
    // 产品兜底数据
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
  
  // 处理文章数据
  let articles: Article[] = []
  let articlesError = false
  
  if (articlesResult.status === 'fulfilled') {
    articles = articlesResult.value
  } else {
    articlesError = true
    console.log('🔄 使用文章兜底数据')
    // 文章兜底数据
    articles = [
      {
        id: 1,
        article_group_id: 'esim-technology-guide',
        title: lng === 'zh' ? 'eSIM 技术指南' : 'eSIM Technology Guide',
        content: lng === 'zh' ? 'eSIM技术详细介绍...' : 'Detailed introduction to eSIM technology...',
        excerpt: lng === 'zh' ? 'eSIM技术的完整指南' : 'Complete guide to eSIM technology',
        slug: 'esim-technology-guide',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: 'eSIM Team',
        featured_image: {
          url: '/placeholder.png',
          alternativeText: lng === 'zh' ? 'eSIM 指南' : 'eSIM Guide'
        },
        category: lng === 'zh' ? '技术' : 'Technology',
        locale: lng
      }
    ]
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {t('subtitle')}
          </p>
          <p className="text-lg mb-8 opacity-90">
            {t('hero_text')}
          </p>
          
          {/* SSR状态指示器 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto mb-8">
            <p className="text-sm">
              📡 {t('data_source')}: {t('server_rendered')}
            </p>
            <p className="text-xs opacity-75 mt-1">
              {new Date().toLocaleString(lng === 'zh' ? 'zh-CN' : 'en-US')}
            </p>
            {(productsError || articlesError) && (
              <p className="text-xs text-yellow-200 mt-1">
                ⚠️ {t('loading_failed')} - {t('using_fallback')}
              </p>
            )}
          </div>
          
          <Link
            href={`/${lng}/products`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('learn_more')}
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('featured_products')}</h2>
            {productsError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ {t('loading_failed')} - {t('using_fallback')}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.slice(0, 6).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {product.image?.url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <Image
                      src={apiUtils.getImageUrl(product.image.url)}
                      alt={product.image.alternativeText || product.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={product.featured}
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      {product.sale_price ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-bold text-red-600">
                            {apiUtils.formatPrice(product.sale_price)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {apiUtils.formatPrice(product.original_price)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          {apiUtils.formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    
                    <Link
                      href={`/${lng}/products/${product.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      {t('learn_more')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              href={`/${lng}/products`}
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {t('view_all_products')}
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('latest_news')}</h2>
            {articlesError && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto mb-4">
                <p className="text-yellow-800 text-sm">
                  ⚠️ {t('loading_failed')} - {t('using_fallback')}
                </p>
              </div>
            )}
          </div>
          
          <Suspense fallback={<div className="text-center">Loading articles...</div>}>
            <BlogPreview articles={articles} lng={lng} />
          </Suspense>
          
          <div className="text-center mt-12">
            <Link
              href={`/${lng}/blog`}
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              {t('view_all_articles')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
} 