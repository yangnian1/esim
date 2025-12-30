import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/supabase-services'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BlogContentRenderer } from '@/components/BlogContentRenderer'
import { BlogFeaturedImage } from '@/components/BlogFeaturedImage'
import type { ContentBlock } from '@/types/supabase'

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

  // 处理内容：判断是新格式（块级结构）还是旧格式（字符串）
  const isBlockContent = Array.isArray(post.content)
  const contentBlocks = isBlockContent ? (post.content as ContentBlock[]) : null
  const contentString = !isBlockContent ? (post.content as string) : null

  return (
    <main className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="container mx-auto px-4 py-12 max-w-full">
        <article className="max-w-4xl mx-auto w-full">
          {/* 文章头图 */}
          {post.featured_image && (
            <BlogFeaturedImage src={post.featured_image} alt={post.title} />
          )}

          {/* 文章头部 */}
          <header className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8 mb-8 w-full overflow-hidden">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 break-words">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600 mb-4">
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
              {post.meta_data?.reading_time && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {post.meta_data.reading_time} {lng === 'zh' ? '分钟阅读' : lng === 'de' ? 'Min. Lesezeit' : 'min read'}
                </span>
              )}
              {post.meta_data?.author_name && (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  {post.meta_data.author_name}
                </span>
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
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
            {post.excerpt && (
              <div className="text-lg text-gray-700 italic mb-6 pb-6 border-b">
                {post.excerpt}
              </div>
            )}

            {/* 使用新的块级内容渲染器或旧的 Markdown 渲染器 */}
            {isBlockContent && contentBlocks ? (
              <BlogContentRenderer blocks={contentBlocks} />
            ) : contentString ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {contentString}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500">{lng === 'zh' ? '暂无内容' : lng === 'de' ? 'Kein Inhalt' : 'No content'}</p>
            )}
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
