import Link from 'next/link'
import { Suspense } from 'react'
import { getProducts } from '@/lib/supabase-services'
import { ProductImage } from '@/components/ProductImage'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Global eSIM Service',
    subtitle: 'Stay connected worldwide with our reliable eSIM solutions',
    hero_text: 'Welcome to the future of mobile connectivity',
    learn_more: 'Learn More',
    view_all_products: 'View All Products',
    view_all_articles: 'View All Articles',
    featured_products: 'Featured Products',
    loading_products: 'Loading products...',
    no_products: 'No products available',
    validity: 'Validity',
    days: 'days',
    stock: 'Stock',
    country: 'Country',
    view_details: 'View Details',
  },
  zh: {
    title: '全球 eSIM 服务',
    subtitle: '使用我们可靠的 eSIM 解决方案保持全球连接',
    hero_text: '欢迎来到移动连接的未来',
    learn_more: '了解更多',
    view_all_products: '查看所有产品',
    view_all_articles: '查看所有文章',
    featured_products: '精选产品',
    loading_products: '加载中...',
    no_products: '暂无产品',
    validity: '有效期',
    days: '天',
    stock: '库存',
    country: '国家',
    view_details: '查看详情',
  },
  vi: {
    title: 'Dịch vụ eSIM Toàn cầu',
    subtitle: 'Giữ kết nối trên toàn thế giới với giải pháp eSIM đáng tin cậy của chúng tôi',
    hero_text: 'Chào mừng đến với tương lai của kết nối di động',
    learn_more: 'Tìm hiểu thêm',
    view_all_products: 'Xem Tất cả Sản phẩm',
    view_all_articles: 'Xem Tất cả Bài viết',
    featured_products: 'Sản phẩm Nổi bật',
    loading_products: 'Đang tải sản phẩm...',
    no_products: 'Không có sản phẩm',
    validity: 'Hiệu lực',
    days: 'ngày',
    stock: 'Kho',
    country: 'Quốc gia',
    view_details: 'Xem Chi tiết',
  },
  de: {
    title: 'Globaler eSIM-Service',
    subtitle: 'Bleiben Sie weltweit mit unseren zuverlässigen eSIM-Lösungen verbunden',
    hero_text: 'Willkommen in der Zukunft der mobilen Konnektivität',
    learn_more: 'Mehr erfahren',
    view_all_products: 'Alle Produkte anzeigen',
    view_all_articles: 'Alle Artikel anzeigen',
    featured_products: 'Ausgewählte Produkte',
    loading_products: 'Produkte werden geladen...',
    no_products: 'Keine Produkte verfügbar',
    validity: 'Gültigkeit',
    days: 'Tage',
    stock: 'Lager',
    country: 'Land',
    view_details: 'Details anzeigen',
  },
}

// 产品列表组件（用于首页）
async function FeaturedProducts({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  // 获取前6个产品
  const { data: products, error } = await getProducts({
    locale: lng,
    page: 1,
    pageSize: 6,
  })

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          href={`/${lng}/products`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('view_all_products')}
        </Link>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">{t('no_products')}</p>
        <Link
          href={`/${lng}/products`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('view_all_products')}
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* 产品图片 */}
            <ProductImage
              imageUrl={product.image_url}
              alt={product.name}
              country={product.country}
            />

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* 产品信息 */}
              <div className="space-y-2 mb-4">
                {product.country && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('country')}:</span>
                    <span className="font-medium">{product.country}</span>
                  </div>
                )}
                {product.validity_days && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t('validity')}:</span>
                    <span className="font-medium">
                      {product.validity_days} {t('days')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('stock')}:</span>
                  <span className={`font-medium ${(product.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock ?? 0}
                  </span>
                </div>
              </div>

              {/* 价格和按钮 */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <span className="text-2xl font-bold text-blue-600">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <Link
                  href={`/${lng}/products/${product.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {t('view_details')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 查看所有产品按钮 */}
      <div className="text-center">
        <Link
          href={`/${lng}/products`}
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          {t('view_all_products')}
        </Link>
      </div>
    </>
  )
}

// 加载状态组件
function ProductsLoading({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">{t('loading_products')}</p>
    </div>
  )
}

export default async function Home({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

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

          <Link
            href={`/${lng}/products`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('learn_more')}
          </Link>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('featured_products')}</h2>
          
          <Suspense fallback={<ProductsLoading lng={lng} />}>
            <FeaturedProducts lng={lng} />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{lng === 'zh' ? '最新资讯' : 'Latest News'}</h2>
          <p className="text-gray-600 mb-8">{lng === 'zh' ? '文章内容即将上线' : 'Articles coming soon'}</p>

          <Link
            href={`/${lng}/blog`}
            className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            {t('view_all_articles')}
          </Link>
        </div>
      </section>
    </main>
  )
}
