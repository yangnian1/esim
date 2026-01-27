import { BlogFeaturedImage } from '@/components/BlogFeaturedImage'
import { MarkdownRenderer } from '@/components/markdown/MarkdownRenderer'
import type { LocalizedBlogPost } from '@/types/supabase'

type BlogLayoutProps = {
  post: LocalizedBlogPost
  markdown: string
}

export function BlogLayout({ post, markdown }: BlogLayoutProps) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <article className="max-w-4xl mx-auto space-y-8">
          {post.featured_image && (
            <BlogFeaturedImage src={post.featured_image} alt={post.title} />
          )}

          <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-gray-600">{post.excerpt}</p>}
          </header>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <MarkdownRenderer markdown={markdown} className="prose prose-lg max-w-none" />
          </div>
        </article>
      </div>
    </main>
  )
}
