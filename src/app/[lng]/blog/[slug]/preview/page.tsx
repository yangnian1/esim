import Link from 'next/link'
import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { getBlogPostBySlug } from '@/lib/supabase-services'
import { BlogArticle } from '@/components/blog/BlogArticle'
import { PreviewBanner } from '@/components/PreviewBanner'
import { getBlogDetailT } from '../translations'

/**
 * 草稿预览：/{lng}/blog/{slug}/preview?token=xxx
 *
 * 鉴权用共享密钥而不是登录 —— 前台已经没有用户体系了。
 * 草稿不是机密，泄露的最坏后果是有人提前看到一篇没写完的文章，
 * 用密钥换掉整套登录是划算的：博客列表因此不用再读会话，可以静态化。
 *
 * 链接从后台生成，形如：
 *   https://…/de/blog/mein-artikel/preview?token=<PREVIEW_SECRET>
 *
 * 必须是纯动态：它读 searchParams，而且渲染的是未发布内容，任何缓存都不合适。
 */
export const dynamic = 'force-dynamic'

// 预览页永远不进索引。robots.txt 也屏蔽了这个路径，这里是双保险。
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

interface PreviewProps {
  params: Promise<{ lng: string; slug: string }>
  searchParams: Promise<{ token?: string }>
}

/** 定长比较，避免用 === 比较密钥时的计时差异 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function Notice({ lng, title, message }: { lng: string; title: string; message: string }) {
  const t = getBlogDetailT(lng)
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">{title}</h1>
          {message && <p className="text-gray-600 mb-8">{message}</p>}
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

export default async function BlogPreviewPage({ params, searchParams }: PreviewProps) {
  const { lng, slug } = await params
  const { token } = await searchParams
  const t = getBlogDetailT(lng)

  const secret = process.env.PREVIEW_SECRET
  if (!secret) {
    return <Notice lng={lng} title={t('unauthorized')} message="未配置 PREVIEW_SECRET" />
  }
  if (!token || !safeEqual(token, secret)) {
    return <Notice lng={lng} title={t('unauthorized')} message="" />
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return <Notice lng={lng} title={t('error')} message="Missing Supabase env" />
  }

  // ⚠️ 用 service_role 读草稿：RLS 收口后 anon 只能读已发布内容。
  // 这个 key 只在服务端出现，绝不能加 NEXT_PUBLIC_ 前缀。
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return <Notice lng={lng} title={t('error')} message="未配置 SUPABASE_SERVICE_ROLE_KEY" />
  }
  const supabase = createClient<Database>(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: post } = await getBlogPostBySlug(slug, lng, true, supabase)
  if (!post || !post.body) {
    return <Notice lng={lng} title={t('not_found')} message="" />
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
