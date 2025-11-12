import Link from 'next/link'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Global eSIM Service',
    subtitle: 'Stay connected worldwide with our reliable eSIM solutions',
    hero_text: 'Welcome to the future of mobile connectivity',
    learn_more: 'Learn More',
    view_all_products: 'View All Products',
    view_all_articles: 'View All Articles',
  },
  zh: {
    title: '全球 eSIM 服务',
    subtitle: '使用我们可靠的 eSIM 解决方案保持全球连接',
    hero_text: '欢迎来到移动连接的未来',
    learn_more: '了解更多',
    view_all_products: '查看所有产品',
    view_all_articles: '查看所有文章',
  }
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
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">{lng === 'zh' ? '精选产品' : 'Featured Products'}</h2>
          <p className="text-gray-600 mb-8">{lng === 'zh' ? '产品内容即将上线' : 'Products coming soon'}</p>

          <Link
            href={`/${lng}/products`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('view_all_products')}
          </Link>
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
