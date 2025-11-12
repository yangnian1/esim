import Link from 'next/link'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_blog: 'Back to Blog',
    coming_soon: 'Article content coming soon'
  },
  zh: {
    blog: '博客',
    back_to_blog: '返回博客',
    coming_soon: '文章内容即将上线'
  },
  fr: {
    blog: 'Blog',
    back_to_blog: 'Retour au blog',
    coming_soon: 'Contenu de l\'article à venir'
  },
  de: {
    blog: 'Blog',
    back_to_blog: 'Zurück zum Blog',
    coming_soon: 'Artikelinhalt kommt bald'
  },
  es: {
    blog: 'Blog',
    back_to_blog: 'Volver al blog',
    coming_soon: 'Contenido del artículo próximamente'
  },
  ja: {
    blog: 'ブログ',
    back_to_blog: 'ブログに戻る',
    coming_soon: '記事の内容は近日公開'
  }
}

interface BlogDetailProps {
  params: Promise<{
    lng: string
    id: string
  }>
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { lng, id } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <main className="flex min-h-screen flex-col p-8 md:p-24">
      <div className="z-10 w-full max-w-4xl mx-auto">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('coming_soon')}
          </h1>

          <div className="text-gray-600 mb-8">
            Article ID: {id}
          </div>

          <div className="prose prose-lg max-w-none text-gray-800">
            <p>{lng === 'zh' ? '文章内容即将推出' : 'Article content will be available soon'}</p>
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href={`/${lng}/blog`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← {t('back_to_blog')}
          </Link>
        </div>
      </div>
    </main>
  )
}
