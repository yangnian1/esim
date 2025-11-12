import Link from 'next/link'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_home: 'Back to Home',
    coming_soon: 'Articles coming soon',
    description: 'Blog articles will be available soon'
  },
  zh: {
    blog: '博客',
    back_to_home: '返回首页',
    coming_soon: '文章即将上线',
    description: '博客文章即将推出'
  }
}

export default async function Blog({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-4xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-12">{t('blog')}</h1>

        <div className="text-center py-12">
          <p className="text-2xl text-gray-500 mb-4">{t('coming_soon')}</p>
          <p className="text-gray-600">{t('description')}</p>
        </div>

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
