import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ContentBlock } from '@/types/supabase'
import { getCurrentUserServer, createServerClient } from '@/lib/supabase-server'
import { getPostBySlug, getTurkeyPlans } from '@/lib/blog'
import { extractFaqSection, extractHeadings } from '@/lib/markdown'
import { BlogContentRenderer } from '@/components/BlogContentRenderer'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { PillarLayout } from '@/components/blog/PillarLayout'
import { TurkeyPlansWidget } from '@/components/blog/TurkeyPlansWidget'
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
    toc_title: 'Contents',
    faq_title: 'FAQ',
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
  let serverClient: Awaited<ReturnType<typeof createServerClient>> | undefined = undefined
  if (isPreviewMode) {
    // 创建服务端客户端以获取用户会话
    serverClient = await createServerClient()
    const { user } = await getCurrentUserServer()
    if (user) {
      // 先获取文章（包括草稿）以检查作者，使用服务端客户端
      const { data: postForAuth } = await getPostBySlug(lng, slug, {
        allowDraft: true,
        client: serverClient,
      })
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
  const { data: post, error } = await getPostBySlug(lng, slug, {
    allowDraft,
    client: isPreviewMode && isAuthorized ? serverClient : undefined,
  })

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
  const metaTemplate = (post.meta_data as Record<string, unknown> | null)?.template
  const resolvedTemplate = metaTemplate === 'pillar' ? 'pillar' : 'blog'

  if (contentBlocks && !contentString) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          {isPreviewMode && isAuthorized && post.status === 'draft' && <PreviewBanner lng={lng} />}
          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-gray-600">{post.excerpt}</p>}
          </header>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <BlogContentRenderer blocks={contentBlocks} />
          </div>
        </div>
      </main>
    )
  }

  const markdownSource = contentString || ''
  const { content: contentWithoutFaq, faqs } = extractFaqSection(markdownSource)
  const headings = extractHeadings(contentWithoutFaq)
  const shouldLoadTurkeyPlans =
    resolvedTemplate === 'pillar' && markdownSource.includes('{{TurkeyPlansWidget}}')
  const turkeyPlansResult = shouldLoadTurkeyPlans ? await getTurkeyPlans(lng, 6) : null

  const stripMarkdown = (value: string) =>
    value
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/[`*_>#-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  const faqJsonLd =
    faqs.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: stripMarkdown(faq.answer || ''),
            },
          })),
        })
      : null

  const layout =
    resolvedTemplate === 'pillar' ? (
      <PillarLayout
        post={post}
        markdown={contentWithoutFaq}
        headings={headings}
        faqs={faqs}
        tocTitle={t('toc_title')}
        faqTitle={t('faq_title')}
        widget={
          shouldLoadTurkeyPlans && turkeyPlansResult ? (
            <TurkeyPlansWidget products={turkeyPlansResult.data} lng={lng} />
          ) : undefined
        }
      />
    ) : (
      <BlogLayout post={post} markdown={markdownSource} />
    )

  return (
    <>
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      ) : null}
      {isPreviewMode && isAuthorized && post.status === 'draft' ? (
        <div className="container mx-auto px-4 pt-6">
          <PreviewBanner lng={lng} />
        </div>
      ) : null}
      {layout}
    </>
  )
}

export async function generateMetadata({ params }: BlogDetailProps) {
  const { lng, slug } = await params

  const { data: post } = await getPostBySlug(lng, slug)

  if (!post) {
    return {
      title: 'Article Not Found',
    }
  }

  const seo = (post.meta_data as Record<string, unknown> | null)?.seo as
    | { title?: string; description?: string; canonical?: string }
    | undefined
  const title = seo?.title || post.seo_title || post.title
  const description = seo?.description || post.seo_description || post.excerpt || ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const canonicalFromMeta = seo?.canonical
  const canonical = canonicalFromMeta
    ? canonicalFromMeta.startsWith('http')
      ? canonicalFromMeta
      : siteUrl
        ? `${siteUrl}/${canonicalFromMeta.replace(/^\//, '')}`
        : canonicalFromMeta
    : siteUrl
      ? `${siteUrl}/${lng}/blog/${post.slug}`
      : undefined

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
  }
}
