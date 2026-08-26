import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'
import Link from 'next/link'
import { getPublishedPosts } from '@/lib/blog'
import { Suspense } from 'react'
import { BlogCardImage } from '@/components/BlogCardImage'
import { languages } from '@/i18n/settings'

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

  // 只取已发布文章。**不要在这里读会话** ——
  // 一读会话 Next 就会把整页降级成纯动态 SSR，而这是所有文章的入口页，
  // 那意味着每个爬虫请求都要现打一次 Supabase，revalidatePath 也会失去作用对象。
  // 草稿现在通过后台生成的预览链接查看（/blog/{slug}/preview?token=…）。
  const { data: posts, error } = await getPublishedPosts(lng, 20)

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
        const postSlug = post.slug.replace(/^\/+/, '')
        return (
        <Link
          key={post.id}
          href={`/${lng}/blog/${postSlug}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col block"
        >
          {/* 文章头图 */}
          <BlogCardImage src={post.featured_image} alt={post.title} />

          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-purple-600 transition-colors">
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
              <span className="text-purple-600 hover:text-purple-800 transition-colors text-sm font-medium">
                {t('read_more')} →
              </span>
            </div>
          </div>
        </Link>
        )})}
      </div>
    </>
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

// 逐语种的 title/description。
// 这几个页面原来一个 metadata 都没有，全部继承根 layout 那句英文标题，
// 12 个 URL 共用一个 title —— 对多语种站是致命的。
const SEO_COPY = {
  de: {
    title: 'eSIM Ratgeber für Reisende',
    description: 'Anleitungen und Tipps rund um eSIM: Aktivierung, Tarifwahl und Reiseziele.',
  },
  en: {
    title: 'eSIM Guides for Travellers',
    description: 'Guides and tips around eSIM: activation, choosing a plan and destinations.',
  },
  zh: {
    title: 'eSIM 旅行指南',
    description: 'eSIM 相关的教程与技巧：激活、选套餐、目的地攻略。',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  const { lng } = await params
  return buildPageMetadata({ lng, path: (l) => `/${l}/blog`, copy: SEO_COPY })
}

export default async function BlogPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 博客文章列表 */}
        <Suspense fallback={<BlogLoading lng={lng} />}>
          <BlogPostsList lng={lng} />
        </Suspense>
      </div>
    </main>
  )
}

// 生成静态参数（用于静态生成）
// 以 i18n/settings.ts 的 languages 为准，不要硬编码 —— 硬编码会生成
// 未启用语种（如 vi）的孤儿页面：middleware 不认它，sitemap 也不收录。
export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

// ISR: 每小时重新验证一次数据（3600秒）
export const revalidate = 3600
