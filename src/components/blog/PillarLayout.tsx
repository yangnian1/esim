import type { ReactNode } from 'react'
import { BlogFeaturedImage } from '@/components/BlogFeaturedImage'
import type { LocalizedBlogPost } from '@/types/supabase'
import type { FaqItem, TocHeading } from '@/lib/markdown'
import { Toc } from '@/components/markdown/Toc'
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer'

type PillarLayoutProps = {
  post: LocalizedBlogPost
  markdown: string
  headings: TocHeading[]
  faqs: FaqItem[]
  tocTitle: string
  faqTitle: string
  widget?: ReactNode
  showToc?: boolean
}

export function PillarLayout({
  post,
  markdown,
  headings,
  faqs,
  tocTitle,
  faqTitle,
  widget,
  showToc = true,
}: PillarLayoutProps) {
  const hasToc = showToc && headings.length > 0

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <article className="space-y-8">
          {post.featured_image && (
            <BlogFeaturedImage src={post.featured_image} alt={post.title} />
          )}

          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-gray-600">{post.excerpt}</p>}
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr] lg:items-start">
            {hasToc ? (
              <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
                <div className="max-h-[calc(100vh-6rem)] overflow-auto">
                  <Toc headings={headings} title={tocTitle} />
                </div>
              </aside>
            ) : (
              <div className="hidden lg:block" />
            )}

            <div className="space-y-8">
              {hasToc ? (
                <div className="lg:hidden sticky top-20 z-20">
                  <details className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-700">
                      {tocTitle}
                    </summary>
                    <div className="mt-4">
                      <Toc headings={headings} title="" />
                    </div>
                  </details>
                </div>
              ) : null}

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <MarkdownRenderer
                  markdown={markdown}
                  headings={headings}
                  className="prose prose-lg max-w-none"
                  widgetMap={widget ? { TurkeyPlansWidget: widget } : undefined}
                />
              </div>

              {faqs.length > 0 && (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">{faqTitle}</h2>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <details
                        key={faq.question}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                      >
                        <summary className="cursor-pointer text-base font-medium text-gray-900">
                          {faq.question}
                        </summary>
                        {faq.answer && (
                          <div className="mt-3 text-sm text-gray-700">
                            <MarkdownRenderer
                              markdown={faq.answer}
                              className="prose prose-sm max-w-none"
                            />
                          </div>
                        )}
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
