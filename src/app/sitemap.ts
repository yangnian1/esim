import { MetadataRoute } from 'next'
import { languages } from '@/i18n/settings'
import { getProducts, getBlogPosts } from '@/lib/supabase-services'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com'

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = []

  // 为每种语言生成首页、产品页、博客页等
  for (const lng of languages) {
    staticPages.push(
      {
        url: `${baseUrl}/${lng}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
        alternates: {
          languages: Object.fromEntries(
            languages.map(lang => [lang, `${baseUrl}/${lang}`])
          ),
        },
      },
      {
        url: `${baseUrl}/${lng}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: {
          languages: Object.fromEntries(
            languages.map(lang => [lang, `${baseUrl}/${lang}/products`])
          ),
        },
      },
      {
        url: `${baseUrl}/${lng}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            languages.map(lang => [lang, `${baseUrl}/${lang}/blog`])
          ),
        },
      },
      {
        url: `${baseUrl}/${lng}/orders`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }
    )
  }

  // 动态获取产品页面（仅使用第一个语言以避免重复）
  const { data: products } = await getProducts(languages[0])
  const productPages: MetadataRoute.Sitemap = []

  if (products && products.length > 0) {
    for (const product of products) {
      for (const lng of languages) {
        productPages.push({
          url: `${baseUrl}/${lng}/products/${product.slug}`,
          lastModified: new Date(product.updated_at),
          changeFrequency: 'weekly',
          priority: 0.8,
          alternates: {
            languages: Object.fromEntries(
              languages.map(lang => [lang, `${baseUrl}/${lang}/products/${product.slug}`])
            ),
          },
        })
      }
    }
  }

  // 动态获取博客文章页面
  const { data: posts } = await getBlogPosts(languages[0])
  const blogPages: MetadataRoute.Sitemap = []

  if (posts && posts.length > 0) {
    for (const post of posts) {
      for (const lng of languages) {
        blogPages.push({
          url: `${baseUrl}/${lng}/blog/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: Object.fromEntries(
              languages.map(lang => [lang, `${baseUrl}/${lang}/blog/${post.slug}`])
            ),
          },
        })
      }
    }
  }

  return [...staticPages, ...productPages, ...blogPages]
}
