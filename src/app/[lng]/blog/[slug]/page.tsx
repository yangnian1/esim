import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug } from '@/lib/blog'
import { getPublishedPostLocales } from '@/lib/supabase-services'
import { firstBodyImage } from '@/lib/markdown'
import { languages, fallbackLng } from '@/i18n/settings'
import { BlogArticle } from '@/components/blog/BlogArticle'
import { getBlogDetailT } from './translations'

// 这一页是全站 SEO 的主力，必须能被静态生成 + ISR。
// 注意：这里绝对不能读 searchParams —— 一旦读了，Next 会把整页降级成纯动态 SSR，
// 每个爬虫请求都要现打一次 Supabase，同时 /api/revalidate 也会变成空转
// （revalidatePath 对动态页没有可失效的缓存）。
// 草稿预览因此被拆到了独立路由 ./preview/。
export const revalidate = 3600

/** 取正文里第一张 <Figure /> 的 src，用作缺少头图时的代表图 */
interface BlogDetailProps {
  params: Promise<{
    lng: string
    slug: string
  }>
}

export async function generateStaticParams() {
  // 只生成**真正有该语种译文**的组合，不做 languages × slugs 的笛卡尔积。
  // 没有英文版的文章就不该有 /en/blog/xxx 这个 URL。
  const { data } = await getPublishedPostLocales()
  return (data ?? []).flatMap((post) => post.locales.map((lng) => ({ lng, slug: post.slug })))
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

  // hreflang 只列这篇文章**真实存在**的语种版本。
  // 把没有译文的语种也写进去，Google 抓过去只会拿到 404，反而伤害整组页面。
  // 只有一个语种时干脆不输出 —— 一条 hreflang 指向自己没有意义。
  const alternates: Metadata['alternates'] = {}
  if (canonical) alternates.canonical = canonical
  if (siteUrl) {
    const { data: postLocales } = await getPublishedPostLocales()
    const self = (postLocales ?? []).find((row) => row.slug === normalizedSlug)
    const available = (self?.locales ?? []).filter((l) => languages.includes(l))
    if (available.length > 1) {
      alternates.languages = {
        ...Object.fromEntries(
          available.map((l) => [l, `${siteUrl}/${l}/blog/${normalizedSlug}`])
        ),
        // x-default 指向 en；没有英文版时退回该文章的第一个语种
        'x-default': `${siteUrl}/${
          available.includes(fallbackLng) ? fallbackLng : available[0]
        }/blog/${normalizedSlug}`,
      }
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
      // Google 建议为落地页指定一张"代表性"图片。没有头图时退回正文第一张 ——
      // 否则分享卡片和图片搜索都拿不到任何图。
      images: (() => {
        const primary = post.featured_image || firstBodyImage(post.body)
        return primary ? [primary] : undefined
      })(),
    },
  }
}
