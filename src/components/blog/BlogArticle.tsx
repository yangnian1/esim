import { getTurkeyPlans } from '@/lib/blog'
import { extractFaqSection, extractHeadings } from '@/lib/markdown'
import { BlogLayout } from '@/components/blog/BlogLayout'
import { PillarLayout } from '@/components/blog/PillarLayout'
import { TurkeyPlansWidget } from '@/components/blog/TurkeyPlansWidget'
import type { LocalizedBlogPost } from '@/types/supabase'

// 文章正文的渲染主体。
// 正式页（静态生成）和预览页（强制动态）都用这一个组件渲染，
// 两条路径唯一的区别是「怎么把 post 取出来」，取到之后的渲染必须完全一致 ——
// 否则预览看到的排版就不是读者最终看到的排版，预览也就失去意义了。
interface BlogArticleProps {
  post: LocalizedBlogPost
  lng: string
  tocTitle: string
  faqTitle: string
}

const stripMarkdown = (value: string) =>
  value
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export async function BlogArticle({ post, lng, tocTitle, faqTitle }: BlogArticleProps) {
  const markdownSource = post.body || ''

  const metaData = post.meta_data as Record<string, unknown> | null
  const resolvedTemplate = metaData?.template === 'pillar' ? 'pillar' : 'blog'
  const tocEnabled = (metaData?.toc as { enabled?: boolean } | undefined)?.enabled !== false

  const { content: contentWithoutFaq, faqs } = extractFaqSection(markdownSource)
  const headings = extractHeadings(contentWithoutFaq)

  // 正文里出现 <TurkeyPlansWidget /> 才去查产品，避免每篇文章都白打一次数据库。
  //
  // 这里曾经还兼容历史写法 {{...}}，2026-08-28 去掉了：那种写法在 MDX 里
  // 本来就渲染不出组件（见 MdxRenderer 的注释），认它只会白查一次产品表。
  // 库里已无文章使用，导入校验器（admin/lib/article-import.ts）也会直接拒绝。
  const shouldLoadTurkeyPlans =
    resolvedTemplate === 'pillar' && markdownSource.includes('<TurkeyPlansWidget')
  const turkeyPlansResult = shouldLoadTurkeyPlans ? await getTurkeyPlans(lng, 6) : null

  // Article 结构化数据。Google 的图片文档明确写着「必须提供图片属性字段
  // 才能显示标记」—— image 是拿到富媒体结果的前提，不是可选项。
  // 图片优先用头图，没有就取正文第一张。
  const primaryImage =
    post.featured_image ||
    /<Figure\b[^>]*?src=["']([^"']+)["']/.exec(markdownSource)?.[1] ||
    null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || undefined,
    inLanguage: lng,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    image: primaryImage ? [primaryImage] : undefined,
    mainEntityOfPage: siteUrl
      ? {
          '@type': 'WebPage',
          '@id': `${siteUrl}/${lng}/blog/${post.slug.replace(/^\/+/, '')}`,
        }
      : undefined,
  })

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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      ) : null}
      {resolvedTemplate === 'pillar' ? (
        <PillarLayout
          post={post}
          mdxSource={contentWithoutFaq}
          headings={headings}
          faqs={faqs}
          tocTitle={tocTitle}
          faqTitle={faqTitle}
          showToc={tocEnabled}
          widget={
            shouldLoadTurkeyPlans && turkeyPlansResult ? (
              <TurkeyPlansWidget products={turkeyPlansResult.data} lng={lng} />
            ) : undefined
          }
        />
      ) : (
        <BlogLayout post={post} mdxSource={markdownSource} />
      )}
    </>
  )
}
