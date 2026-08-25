import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getPublishedPosts } from '@/lib/blog'
import { languages, fallbackLng } from '@/i18n/settings'
import { BlogArticle } from '@/components/blog/BlogArticle'
import { getBlogDetailT } from './translations'

// 这一页是全站 SEO 的主力，必须能被静态生成 + ISR。
// 注意：这里绝对不能读 searchParams —— 一旦读了，Next 会把整页降级成纯动态 SSR，
// 每个爬虫请求都要现打一次 Supabase，同时 /api/revalidate 也会变成空转
// （revalidatePath 对动态页没有可失效的缓存）。
// 草稿预览因此被拆到了独立路由 ./preview/。
export const revalidate = 3600

interface BlogDetailProps {
  params: Promise<{
    lng: string
    slug: string
  }>
}

export async function generateStaticParams() {
  // 服务层默认 pageSize=10，照默认取只会预渲染最新 10 篇
  const { data } = await getPublishedPosts(fallbackLng, 1000)
  const slugs = (data ?? [])
    .map((post) => post.slug.replace(/^\/+/, ''))
    .filter((slug) => slug.length > 0)

  return languages.flatMap((lng) => slugs.map((slug) => ({ lng, slug })))
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { lng, slug } = await params
  const t = getBlogDetailT(lng)

  const { data: post } = await getPostBySlug(lng, slug)

  // 取不到就是 404。以前这里返回的是一个带「加载失败」文案的 200 页面，
  // 那对搜索引擎是 soft 404：状态码说「有内容」，页面上却什么都没有，
  // 会被判定成低质量页并连累整站。
  if (!post || !post.body) {
    notFound()
  }

  return <BlogArticle post={post} lng={lng} tocTitle={t('toc_title')} faqTitle={t('faq_title')} />
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { lng, slug } = await params
  const { data: post } = await getPostBySlug(lng, slug)

  if (!post) {
    return {
      title: getBlogDetailT(lng)('not_found'),
      robots: { index: false, follow: false },
    }
  }

  const seo = (post.meta_data as Record<string, unknown> | null)?.seo as
    | { title?: string; description?: string; canonical?: string }
    | undefined
  const title = seo?.title || post.seo_title || post.title
  const description = seo?.description || post.seo_description || post.excerpt || ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const normalizedSlug = post.slug.replace(/^\/+/, '')

  const canonicalFromMeta = seo?.canonical
  const canonical = canonicalFromMeta
    ? canonicalFromMeta.startsWith('http')
      ? canonicalFromMeta
      : siteUrl
        ? `${siteUrl}/${canonicalFromMeta.replace(/^\//, '')}`
        : canonicalFromMeta
    : siteUrl
      ? `${siteUrl}/${lng}/blog/${normalizedSlug}`
      : undefined

  // 同一篇文章的各语种版本互相声明 hreflang，x-default 指向 en。
  // 缺了这个，小语种页面会被当成 en 版的重复内容，正是这个站最不能出的问题。
  const alternates: Metadata['alternates'] = {}
  if (canonical) alternates.canonical = canonical
  if (siteUrl) {
    alternates.languages = {
      ...Object.fromEntries(
        languages.map((l) => [l, `${siteUrl}/${l}/blog/${normalizedSlug}`])
      ),
      'x-default': `${siteUrl}/${fallbackLng}/blog/${normalizedSlug}`,
    }
  }

  return {
    title,
    description,
    alternates: Object.keys(alternates).length > 0 ? alternates : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: canonical,
      publishedTime: post.published_at || undefined,
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  }
}
