// import Link from 'next/link' // 已隐藏返回按钮，暂时不需要
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articlesApi, apiUtils } from '@/lib/api'
import { Article } from '@/types'
import React from 'react' // 导入React以使用React.Children

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_blog: 'Back to Blog',
    by_author: 'By',
    published_on: 'Published on',
    article_not_found: 'Article not found',
    loading_error: 'Failed to load article'
  },
  zh: {
    blog: '博客',
    back_to_blog: '返回博客',
    by_author: '作者',
    published_on: '发布于',
    article_not_found: '文章未找到',
    loading_error: '文章加载失败'
  },
  fr: {
    blog: 'Blog',
    back_to_blog: 'Retour au blog',
    by_author: 'Par',
    published_on: 'Publié le',
    article_not_found: 'Article non trouvé',
    loading_error: 'Échec du chargement de l\'article'
  },
  de: {
    blog: 'Blog',
    back_to_blog: 'Zurück zum Blog',
    by_author: 'Von',
    published_on: 'Veröffentlicht am',
    article_not_found: 'Artikel nicht gefunden',
    loading_error: 'Artikel konnte nicht geladen werden'
  },
  es: {
    blog: 'Blog',
    back_to_blog: 'Volver al blog',
    by_author: 'Por',
    published_on: 'Publicado el',
    article_not_found: 'Artículo no encontrado',
    loading_error: 'Error al cargar el artículo'
  },
  ja: {
    blog: 'ブログ',
    back_to_blog: 'ブログに戻る',
    by_author: '著者',
    published_on: '公開日',
    article_not_found: '記事が見つかりません',
    loading_error: '記事の読み込みに失敗しました'
  }
}

interface BlogDetailProps {
  params: Promise<{
    lng: string
    id: string  // 现在这里的id就是 article_group_id
  }>
}

export default async function BlogDetail({ params }: BlogDetailProps) {
  const { lng, id } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  
  console.log('📄 博客详情页开始加载，语言:', lng, '组ID:', id)
  
  // 获取文章详情
  let article: Article | null = null
  let error: string | null = null
  
  try {
    console.log('🔍 开始获取文章详情...')
    const response = await articlesApi.getByGroupId(id, lng)
    article = response.data
    console.log('✅ 文章详情获取成功:', article?.title)
  } catch (err) {
    console.error('❌ 获取文章详情失败:', err)
    error = t('loading_error')
  }

  // 如果文章不存在，返回404
  if (!article && !error) {
    notFound()
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-8 text-red-600">{t('loading_error')}</h1>
          <p className="text-gray-600 mb-8">请确保 Strapi 后端服务正在运行</p>
          {/* 返回按钮已隐藏 */}
          {/* <Link 
            href={`/${lng}/blog`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← {t('back_to_blog')}
          </Link> */}
        </div>
      </main>
    )
  }

  if (!article) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <div className="z-10 w-full max-w-4xl text-center">
          <h1 className="text-4xl font-bold mb-8">{t('article_not_found')}</h1>
          {/* 返回按钮已隐藏 */}
          {/* <Link 
            href={`/${lng}/blog`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← {t('back_to_blog')}
          </Link> */}
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col p-8 md:p-24">
      <div className="z-10 w-full max-w-4xl mx-auto">
        {/* 返回按钮 - 已隐藏 */}
        {/* <div className="mb-8">
          <Link 
            href={`/${lng}/blog`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {t('back_to_blog')}
          </Link>
        </div> */}

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 特色图片 */}
          {article.featured_image?.url && (
            <div className="relative h-64 md:h-96">
              <Image
                src={apiUtils.getImageUrl(article.featured_image.url)}
                alt={article.featured_image.alternativeText || article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* 文章标题 */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {/* 文章元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('by_author')} {article.author || 'Admin'}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('published_on')} {apiUtils.formatDate(article.createdAt, lng === 'zh' ? 'zh-CN' : 'en-US')}
              </div>
              {article.category && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {article.category}
                </span>
              )}
            </div>

            {/* 文章摘要 */}
            {article.excerpt && (
              <div className="text-lg text-gray-700 mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                {article.excerpt}
              </div>
            )}

            {/* 文章内容 */}
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // 自定义图片组件 - 使用span避免块级元素嵌套问题
                  img: (props) => (
                    <span className="block my-6">
                      <Image
                        src={typeof props.src === 'string' ? props.src : ''}
                        alt={props.alt || ''}
                        width={800}
                        height={400}
                        className="rounded-lg shadow-md w-full h-auto"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                      {props.alt && (
                        <span className="block text-center text-sm text-gray-600 mt-2">
                          {props.alt}
                        </span>
                      )}
                    </span>
                  ),
                  // 自定义链接组件
                  a: (props) => (
                    <a
                      href={props.href}
                      className="text-blue-600 hover:text-blue-800 underline"
                      target={props.href?.startsWith('http') ? '_blank' : undefined}
                      rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    >
                      {props.children}
                    </a>
                  ),
                  // 自定义段落组件
                  p: (props) => (
                    <p className="mb-4 leading-relaxed">{props.children}</p>
                  ),
                  // 自定义标题组件
                  h1: (props) => (
                    <h1 className="text-2xl font-bold mb-4 mt-8">{props.children}</h1>
                  ),
                  h2: (props) => (
                    <h2 className="text-xl font-bold mb-3 mt-6">{props.children}</h2>
                  ),
                  h3: (props) => (
                    <h3 className="text-lg font-bold mb-2 mt-4">{props.children}</h3>
                  ),
                  // 自定义列表组件
                  ul: (props) => (
                    <ul className="list-disc list-inside mb-4 ml-4">{props.children}</ul>
                  ),
                  ol: (props) => (
                    <ol className="list-decimal list-inside mb-4 ml-4">{props.children}</ol>
                  ),
                  li: (props) => (
                    <li className="mb-1">{props.children}</li>
                  ),
                  // 自定义代码块组件
                  code: (props) => {
                    const isInline = !props.className?.includes('language-')
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                        {props.children}
                      </code>
                    ) : (
                      <code className="block bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                        {props.children}
                      </code>
                    )
                  },
                  // 自定义引用组件
                  blockquote: (props) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
                      {props.children}
                    </blockquote>
                  ),
                }}
              >
                {article.content || ''}
              </ReactMarkdown>
            </div>

            {/* 标签 */}
            {article.tags && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(article.tags) 
                    ? article.tags 
                    : (article.tags as string).split(',')
                  ).map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                    >
                      #{tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* 底部导航 - 已隐藏 */}
        {/* <div className="mt-8 text-center">
          <Link 
            href={`/${lng}/blog`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            ← {t('back_to_blog')}
          </Link>
        </div> */}
      </div>
    </main>
  )
}

// 生成静态参数用于构建时预渲染
export async function generateStaticParams({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  
  try {
    // 获取所有文章用于生成静态路径，改用与首页相同的API调用方式
    const response = await articlesApi.getLatest(lng, 100)
    return response.data.map((article) => ({
      id: article.article_group_id, // 使用 article_group_id 作为路径参数
    }))
  } catch (error) {
    console.warn('Warning: Could not generate static params for blog articles:', error)
    return []
  }
} 