import Link from 'next/link'
import type { Metadata } from 'next'
import { getCurrentUserServer, createServerClient } from '@/lib/supabase-server'
import { getPostBySlug } from '@/lib/blog'
import { BlogArticle } from '@/components/blog/BlogArticle'
import { PreviewBanner } from '@/components/PreviewBanner'
import { getBlogDetailT } from '../translations'

// 草稿预览。这条路由必须是纯动态的 —— 它依赖当前登录用户的会话 cookie，
// 任何缓存都可能把 A 的草稿发给 B。
// 把它从正式页的 ?preview=true 拆出来，正是为了让正式页能静态化。
export const dynamic = 'force-dynamic'

// 预览页永远不进索引：既有 robots.txt 的 disallow，也有这里的 meta 兜底。
// 只靠 robots.txt 不够——被外链指到的 URL 仍可能被收录。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface PreviewProps {
  params: Promise<{
    lng: string
    slug: string
  }>
}

function PreviewNotice({ lng, title, message }: { lng: string; title: string; message: string }) {
  const t = getBlogDetailT(lng)
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{title}</h1>
          <p className="text-gray-600 mb-8">{message}</p>
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

export default async function BlogPreviewPage({ params }: PreviewProps) {
  const { lng, slug } = await params
  const t = getBlogDetailT(lng)

  // 先确认身份，再去读草稿。顺序不能反：
  // 未登录时根本不该发出 allowDraft 的查询。
  const { user } = await getCurrentUserServer()
  if (!user) {
    return <PreviewNotice lng={lng} title={t('unauthorized')} message={t('login_required')} />
  }

  // 用户态客户端，Supabase RLS 是最终兜底
  const serverClient = await createServerClient()
  const { data: post, error } = await getPostBySlug(lng, slug, {
    allowDraft: true,
    client: serverClient,
  })

  if (!post || !post.body) {
    return <PreviewNotice lng={lng} title={t('not_found')} message={error || ''} />
  }

  // 只有作者本人能预览自己的草稿
  if (String(post.author_id) !== String(user.id)) {
    return <PreviewNotice lng={lng} title={t('unauthorized')} message={t('login_required')} />
  }

  return (
    <>
      {post.status === 'draft' ? (
        <div className="container mx-auto px-4 pt-6">
          <PreviewBanner lng={lng} />
        </div>
      ) : null}
      <BlogArticle post={post} lng={lng} tocTitle={t('toc_title')} faqTitle={t('faq_title')} />
    </>
  )
}
