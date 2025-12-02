import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/supabase-services'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_blog: 'Back to Blog',
    published_on: 'Published on',
    tags: 'Tags',
    not_found: 'Article not found',
    error: 'Failed to load article',
  },
  vi: {
    blog: 'Blog',
    back_to_blog: 'Quay lại Blog',
    published_on: 'Xuất bản vào',
    tags: 'Thẻ',
    not_found: 'Không tìm thấy bài viết',
    error: 'Không thể tải bài viết',
  },
  de: {
    blog: 'Blog',
    back_to_blog: 'Zurück zum Blog',
    published_on: 'Veröffentlicht am',
    tags: 'Tags',
    not_found: 'Artikel nicht gefunden',
    error: 'Artikel konnte nicht geladen werden',
  },
  zh: {
    blog: '博客',
    back_to_blog: '返回博客',
    published_on: '发布于',
    tags: '标签',
    not_found: '文章未找到',
    error: '加载失败',
  },
}

// 格式化日期
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  const localeMap: Record<string, string> = {
    en: 'en-US',
    vi: 'vi-VN',
    de: 'de-DE',
    zh: 'zh-CN',
  }
  return date.toLocaleDateString(localeMap[locale] || 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

interface BlogDetailProps {
  params: Promise<{
    lng: string
    slug: string
  }>
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { lng, slug } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  // 从 Supabase 获取博客文章
  const { data: post, error } = await getBlogPostBySlug(slug, lng)

  // 处理错误情况
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">{t('error')}</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link
              href={`/${lng}/blog`}
              className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              ← {t('back_to_blog')}
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // 文章不存在
  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          {/* 返回链接 */}
          <Link
            href={`/${lng}/blog`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-8"
          >
            ← {t('back_to_blog')}
          </Link>

          {/* 文章头部 */}
          <header className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              {post.published_at && (
                <time className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(post.published_at, lng)}
                </time>
              )}
            </div>

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* 文章内容 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            {post.excerpt && (
              <div className="text-lg text-gray-700 italic mb-6 pb-6 border-b">
                {post.excerpt}
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>
          </div>

          {/* 页脚返回链接 */}
          <div className="mt-8 text-center">
            <Link
              href={`/${lng}/blog`}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              ← {t('back_to_blog')}
            </Link>
          </div>
        </article>
      </div>
    </main>
  )
}

// 为 SEO 生成元数据
export async function generateMetadata({ params }: BlogDetailProps) {
  const { lng, slug } = await params

  const { data: post } = await getBlogPostBySlug(slug, lng)

  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || '',
  }
}
