import { MetadataRoute } from 'next'
import { languages, fallbackLng } from '@/i18n/settings'
import { getProducts, getPublishedLandingPages, getPublishedPostLocales } from '@/lib/supabase-services'

// sitemap 一次性取完，不能用服务层的默认分页
// （getBlogPosts 默认 pageSize=10、getProducts 默认 20，
//   照默认值取会导致只有最新几条进 sitemap）
const SITEMAP_PAGE_SIZE = 1000

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (!rawBaseUrl) {
    console.warn(
      '[sitemap] 未配置 NEXT_PUBLIC_SITE_URL，生成的将是占位域名，不要在这种状态下提交给搜索引擎'
    )
  }
  const baseUrl = (rawBaseUrl || 'https://your-domain.com').replace(/\/$/, '')

  // 每条 URL 都带上全语种 hreflang + x-default，指向 en
  const alternatesFor = (path: (lng: string) => string) => ({
    languages: {
      ...Object.fromEntries(languages.map((l) => [l, `${baseUrl}${path(l)}`])),
      'x-default': `${baseUrl}${path(fallbackLng)}`,
    },
  })

  const staticEntries: MetadataRoute.Sitemap = []
  for (const lng of languages) {
    staticEntries.push(
      {
        url: `${baseUrl}/${lng}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
        alternates: alternatesFor((l) => `/${l}`),
      },
      {
        url: `${baseUrl}/${lng}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: alternatesFor((l) => `/${l}/products`),
      },
      {
        url: `${baseUrl}/${lng}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: alternatesFor((l) => `/${l}/blog`),
      }
    )
  }
  // 注意：/[lng]/orders 不进 sitemap —— 联盟模式下没有站内订单，
  // 那个页面只是历史占位页，收录它等于给搜索引擎一个空页面。

  const { data: products } = await getProducts({
    locale: fallbackLng,
    pageSize: SITEMAP_PAGE_SIZE,
  })
  const productEntries: MetadataRoute.Sitemap = (products ?? []).flatMap((product) =>
    languages.map((lng) => ({
      url: `${baseUrl}/${lng}/products/${product.id}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: alternatesFor((l) => `/${l}/products/${product.id}`),
    }))
  )

  // 只收录**真正有该语种译文**的文章 URL。
  // 以前这里是 languages × posts 的笛卡尔积，结果没有英文版的文章
  // 也会生成 /en/blog/xxx —— 页面几乎是空的，却带着 hreflang 声称自己是有效的英文版。
  const { data: postLocales } = await getPublishedPostLocales()
  const blogEntries: MetadataRoute.Sitemap = (postLocales ?? []).flatMap((post) =>
    post.locales.map((lng) => ({
      url: `${baseUrl}/${lng}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      // hreflang 只列这篇文章真实存在的语种；只有一个语种时不输出
      alternates:
        post.locales.length > 1
          ? {
              languages: Object.fromEntries(
                post.locales.map((l) => [l, `${baseUrl}/${l}/blog/${post.slug}`])
              ),
            }
          : undefined,
    }))
  )

  // 程序化落地页。注意这里**不做** languages × slugs 的笛卡尔积 ——
  // 每条 landing_pages 行自带 locale，只有真实存在的组合才进 sitemap。
  const { data: landings } = await getPublishedLandingPages()
  const landingRows = (landings ?? []).filter((row) => languages.includes(row.locale))
  const slugCount = new Map<string, string[]>()
  for (const row of landingRows) {
    const slug = row.slug.replace(/^\/+/, '')
    slugCount.set(slug, [...(slugCount.get(slug) ?? []), row.locale])
  }
  const landingEntries: MetadataRoute.Sitemap = landingRows.map((row) => {
    const slug = row.slug.replace(/^\/+/, '')
    const locales = slugCount.get(slug) ?? [row.locale]
    return {
      url: `${baseUrl}/${row.locale}/${slug}`,
      lastModified: row.updated_at ? new Date(row.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
      // hreflang 只列这个 slug 真实存在的语种
      alternates:
        locales.length > 1
          ? { languages: Object.fromEntries(locales.map((l) => [l, `${baseUrl}/${l}/${slug}`])) }
          : undefined,
    }
  })

  return [...staticEntries, ...productEntries, ...blogEntries, ...landingEntries]
}
