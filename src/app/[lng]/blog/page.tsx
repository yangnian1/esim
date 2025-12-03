import Link from 'next/link'
import { getBlogPosts } from '@/lib/supabase-services'
import { Suspense } from 'react'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_home: 'Back to Home',
    no_posts: 'No articles available',
    loading: 'Loading articles...',
    error: 'Failed to load articles',
    read_more: 'Read More',
    published_on: 'Published on',
    tags: 'Tags',
  },
  vi: {
    blog: 'Blog',
    back_to_home: 'Về Trang chủ',
    no_posts: 'Không có bài viết',
    loading: 'Đang tải bài viết...',
    error: 'Không thể tải bài viết',
    read_more: 'Đọc thêm',
    published_on: 'Xuất bản vào',
    tags: 'Thẻ',
  },
  de: {
    blog: 'Blog',
    back_to_home: 'Zurück zur Startseite',
    no_posts: 'Keine Artikel verfügbar',
    loading: 'Artikel laden...',
    error: 'Artikel konnten nicht geladen werden',
    read_more: 'Weiterlesen',
    published_on: 'Veröffentlicht am',
    tags: 'Tags',
  },
  zh: {
    blog: '博客',
    back_to_home: '返回首页',
    no_posts: '暂无文章',
    loading: '加载中...',
    error: '加载失败',
    read_more: '阅读更多',
    published_on: '发布于',
    tags: '标签',
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

// 博客文章列表组件
async function BlogPostsList({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  // 从 Supabase 获取博客数据
  const { data: posts, error } = await getBlogPosts({
    locale: lng,
    pageSize: 20,
  })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">{t('error')}</p>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">{t('no_posts')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
        >
          {/* 文章占位图 */}
          <div className="relative h-48 bg-gradient-to-br from-purple-400 to-purple-600">
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold px-4 text-center line-clamp-2">
              {post.title}
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                {post.excerpt}
              </p>
            )}

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 发布日期和阅读更多链接 */}
            <div className="flex items-center justify-between pt-4 border-t mt-auto">
              <time className="text-sm text-gray-500">
                {post.published_at && formatDate(post.published_at, lng)}
              </time>
              <Link
                href={`/${lng}/blog/${post.slug}`}
                className="text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium"
              >
                {t('read_more')} →
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

// 加载状态组件
function BlogLoading({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      <p className="mt-4 text-gray-600">{t('loading')}</p>
    </div>
  )
}

// 主页面组件
export default async function BlogPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('blog')}</h1>
          <Link
            href={`/${lng}`}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← {t('back_to_home')}
          </Link>
        </div>

        {/* 博客文章列表 */}
        <Suspense fallback={<BlogLoading lng={lng} />}>
          <BlogPostsList lng={lng} />
        </Suspense>
      </div>
    </main>
  )
}

// 生成静态参数（用于静态生成）
export async function generateStaticParams() {
  return [
    { lng: 'en' },
    { lng: 'vi' },
    { lng: 'de' },
    { lng: 'zh' },
  ]
}

// ISR: 每小时重新验证一次数据（3600秒）
export const revalidate = 3600
