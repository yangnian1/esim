import Link from 'next/link'
import { Suspense } from 'react'
import { getProducts } from '@/lib/supabase-services'
import { ProductImage } from '@/components/ProductImage'
import { Globe, Zap, Wallet } from 'lucide-react'

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
    global_coverage_title: 'Global Coverage',
    global_coverage_desc: 'Connect in over 190 countries with high-speed 4G/5G networks.',
    instant_activation_title: 'Instant Activation',
    instant_activation_desc: 'Scan the QR code and get connected immediately. No physical SIM needed.',
    save_roaming_title: 'Save on Roaming',
    save_roaming_desc: 'Affordable local rates. Say goodbye to expensive roaming fees.',
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
    global_coverage_title: '全球覆盖',
    global_coverage_desc: '在 190 多个国家/地区连接高速 4G/5G 网络。',
    instant_activation_title: '即时激活',
    instant_activation_desc: '扫描二维码即可立即连接。无需实体 SIM 卡。',
    save_roaming_title: '节省漫游费',
    save_roaming_desc: '实惠的本地费率。告别昂贵的漫游费用。',
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
    global_coverage_title: 'Weltweite Abdeckung',
    global_coverage_desc: 'Verbinden Sie sich in über 190 Ländern mit High-Speed 4G/5G Netzwerken.',
    instant_activation_title: 'Sofortige Aktivierung',
    instant_activation_desc: 'QR-Code scannen und sofort verbinden. Keine physische SIM erforderlich.',
    save_roaming_title: 'Roaming sparen',
    save_roaming_desc: 'Günstige lokale Tarife. Verabschieden Sie sich von teuren Roaming-Gebühren.',
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
          className="inline-block bg-[#F97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-md"
        >
          {t('view_all_products')}
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md border border-[#E0F2FE] overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            {/* 产品图片 */}
            <ProductImage
              imageUrl={product.image_url}
              alt={product.name}
              country={product.country}
            />

            <div className="p-6">
              <h3 className="text-xl font-bold text-[#0C4A6E] mb-2 group-hover:text-[#0EA5E9] transition-colors">
                {product.name}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              {/* 产品信息 */}
              <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-lg">
                {product.country && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('country')}:</span>
                    <span className="font-medium text-gray-800">{product.country}</span>
                  </div>
                )}
                {product.validity_days && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('validity')}:</span>
                    <span className="font-medium text-gray-800">
                      {product.validity_days} {t('days')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{t('stock')}:</span>
                  <span className={`font-medium ${(product.stock ?? 0) > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock ?? 0}
                  </span>
                </div>
              </div>

              {/* 价格和按钮 */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="text-2xl font-bold text-[#0EA5E9]">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <Link
                  href={`/${lng}/products/${product.id}`}
                  className="px-5 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-orange-600 hover:shadow-md transition-all text-sm font-semibold"
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
          className="inline-block bg-white text-[#0EA5E9] border-2 border-[#0EA5E9] px-10 py-3 rounded-full font-bold hover:bg-[#0EA5E9] hover:text-white transition-all duration-300"
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
    <main className="flex min-h-screen flex-col bg-[#F0F9FF]">
      {/* Hero Section with Image Background */}
      <section className="relative text-white py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero_bg.png"
            alt="Global eSIM Travel Connectivity"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/75 mix-blend-multiply"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light text-blue-100 drop-shadow-md">
            {t('subtitle')}
          </p>
          <p className="text-lg mb-12 opacity-95 max-w-2xl mx-auto drop-shadow-sm font-medium">
            {t('hero_text')}
          </p>

          <Link
            href={`/${lng}/products`}
            className="inline-block bg-[#F97316] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:bg-orange-600 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 transform"
          >
            {t('learn_more')}
          </Link>
        </div>
      </section>

      {/* Features Section (New Visuals) */}
      <section className="py-16 bg-white -mt-10 relative z-20 container mx-auto rounded-xl shadow-xl px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full p-4 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Globe className="w-10 h-10 text-[#0EA5E9]" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">{t('global_coverage_title')}</h3>
            <p className="text-gray-600">{t('global_coverage_desc')}</p>
          </div>
          <div className="p-6 border-l-0 md:border-l border-r-0 md:border-r border-blue-100">
            <div className="w-20 h-20 mx-auto mb-6 bg-orange-50 rounded-full p-4 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Zap className="w-10 h-10 text-[#F97316]" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">{t('instant_activation_title')}</h3>
            <p className="text-gray-600">{t('instant_activation_desc')}</p>
          </div>
          <div className="p-6">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-50 rounded-full p-4 flex items-center justify-center transition-transform hover:scale-110 duration-300">
              <Wallet className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-[#0C4A6E] mb-3">{t('save_roaming_title')}</h3>
            <p className="text-gray-600">{t('save_roaming_desc')}</p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0C4A6E] mb-4">{t('featured_products')}</h2>
            <div className="w-24 h-1 bg-[#F97316] mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Discover our best-selling data plans for top destinations.</p>
          </div>

          <Suspense fallback={<ProductsLoading lng={lng} />}>
            <FeaturedProducts lng={lng} />
          </Suspense>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white border-t border-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#0C4A6E]">{lng === 'zh' ? '最新资讯' : 'Latest News'}</h2>
          <p className="text-gray-500 mb-10 text-lg">{lng === 'zh' ? '文章内容即将上线' : 'Articles coming soon'}</p>

          <Link
            href={`/${lng}/blog`}
            className="inline-block border-2 border-[#0C4A6E] text-[#0C4A6E] px-8 py-3 rounded-lg font-semibold hover:bg-[#0C4A6E] hover:text-white transition-colors duration-300"
          >
            {t('view_all_articles')}
          </Link>
        </div>
      </section>
    </main>
  )
}
