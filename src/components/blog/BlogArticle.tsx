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

  const shouldLoadTurkeyPlans =
    resolvedTemplate === 'pillar' && markdownSource.includes('{{TurkeyPlansWidget}}')
  const turkeyPlansResult = shouldLoadTurkeyPlans ? await getTurkeyPlans(lng, 6) : null

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
