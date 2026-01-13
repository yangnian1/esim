import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/supabase-services'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BlogContentRenderer } from '@/components/BlogContentRenderer'
import { BlogFeaturedImage } from '@/components/BlogFeaturedImage'
import type { ContentBlock } from '@/types/supabase'
import { getCurrentUserServer, createServerClient } from '@/lib/supabase-server'
import { PreviewBanner } from '@/components/PreviewBanner'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_blog: 'Back to Blog',
    published_on: 'Published on',
    tags: 'Tags',
    not_found: 'Article not found',
    error: 'Failed to load article',
    preview_mode: 'Preview Mode',
    preview_notice: 'This is a draft preview. Other users cannot see this article.',
    unauthorized: 'You do not have permission to preview this article',
    login_required: 'Please log in to preview drafts',
  },
  vi: {
    blog: 'Blog',
    back_to_blog: 'Quay lại Blog',
    published_on: 'Xuất bản vào',
    tags: 'Thẻ',
    not_found: 'Không tìm thấy bài viết',
    error: 'Không thể tải bài viết',
    preview_mode: 'Chế độ xem trước',
    preview_notice: 'Đây là bản xem trước bản nháp. Người dùng khác không thể thấy bài viết này.',
    unauthorized: 'Bạn không có quyền xem trước bài viết này',
    login_required: 'Vui lòng đăng nhập để xem trước bản nháp',
  },
  de: {
    blog: 'Blog',
    back_to_blog: 'Zurück zum Blog',
    published_on: 'Veröffentlicht am',
    tags: 'Tags',
    not_found: 'Artikel nicht gefunden',
    error: 'Artikel konnte nicht geladen werden',
    preview_mode: 'Vorschaumodus',
    preview_notice: 'Dies ist eine Entwurfsvorschau. Andere Benutzer können diesen Artikel nicht sehen.',
    unauthorized: 'Sie haben keine Berechtigung, diesen Artikel in der Vorschau anzuzeigen',
    login_required: 'Bitte melden Sie sich an, um Entwürfe in der Vorschau anzuzeigen',
  },
  zh: {
    blog: '博客',
    back_to_blog: '返回博客',
    published_on: '发布于',
    tags: '标签',
    not_found: '文章未找到',
    error: '加载失败',
    preview_mode: '预览模式',
    preview_notice: '这是草稿预览，其他用户无法看到此文章',
    unauthorized: '您没有权限预览此文章',
    login_required: '请先登录以预览草稿',
  },
  fr: {
    blog: 'Blog',
    back_to_blog: 'Retour au Blog',
    published_on: 'Publié le',
    tags: 'Tags',
    not_found: 'Article non trouvé',
    error: 'Échec du chargement de l\'article',
    preview_mode: 'Mode Aperçu',
    preview_notice: 'Ceci est un aperçu de brouillon. Les autres utilisateurs ne peuvent pas voir cet article.',
    unauthorized: 'Vous n\'avez pas la permission de prévisualiser cet article',
    login_required: 'Veuillez vous connecter pour prévisualiser les brouillons',
  },
  es: {
    blog: 'Blog',
    back_to_blog: 'Volver al Blog',
    published_on: 'Publicado el',
    tags: 'Etiquetas',
    not_found: 'Artículo no encontrado',
    error: 'Error al cargar el artículo',
    preview_mode: 'Modo Vista Previa',
    preview_notice: 'Esta es una vista previa del borrador. Otros usuarios no pueden ver este artículo.',
    unauthorized: 'No tiene permiso para previsualizar este artículo',
    login_required: 'Por favor, inicie sesión para previsualizar borradores',
  },
  ja: {
    blog: 'ブログ',
    back_to_blog: 'ブログに戻る',
    published_on: '公開日',
    tags: 'タグ',
    not_found: '記事が見つかりません',
    error: '記事の読み込みに失敗しました',
    preview_mode: 'プレビューモード',
    preview_notice: 'これは下書きプレビューです。他のユーザーはこの記事を見ることができません。',
    unauthorized: 'この記事をプレビューする権限がありません',
    login_required: '下書きをプレビューするにはログインしてください',
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
  searchParams: Promise<{
    preview?: string
  }>
}

export default async function BlogDetailPage({ params, searchParams }: BlogDetailProps) {
  const { lng, slug } = await params
  const { preview } = await searchParams
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  // 检查是否为预览模式
  const isPreviewMode = preview === 'true'
  let allowDraft = false
  let isAuthorized = false

  // 如果是预览模式，检查用户权限
  let serverClient = null
  if (isPreviewMode) {
    // 创建服务端客户端以获取用户会话
    serverClient = await createServerClient()
    const { user, error: userError } = await getCurrentUserServer()
    if (user) {
      // 先获取文章（包括草稿）以检查作者，使用服务端客户端
      const { data: postForAuth } = await getBlogPostBySlug(slug, lng, true, serverClient)
      // 比较用户ID和作者ID（确保类型一致，都转换为字符串比较）
      if (postForAuth && postForAuth.author_id) {
        const userId = String(user.id)
        const authorId = String(postForAuth.author_id)
        if (userId === authorId) {
          allowDraft = true
          isAuthorized = true
        }
      }
    }
  }

  // 从 Supabase 获取博客文章
  // 如果是预览模式且已授权，使用服务端客户端
  const { data: post, error } = await getBlogPostBySlug(slug, lng, allowDraft, isPreviewMode && isAuthorized ? serverClient : undefined)

  // 如果是预览模式但未授权
  if (isPreviewMode && !isAuthorized) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">{t('unauthorized')}</h1>
            <p className="text-gray-600 mb-8">
              {error || t('login_required')}
            </p>
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
        {/* 预览模式提示横幅 */}
        {isPreviewMode && isAuthorized && post.status === 'draft' && (
          <PreviewBanner lng={lng} />
        )}
        
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

  const { data: post } = await getBlogPostBySlug(slug, lng, false)

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
