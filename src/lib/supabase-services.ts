import { supabase, extractLocalized, handleSupabaseError } from './supabase'
import { languages } from '@/i18n/settings'
import type { LocalizedProduct, LocalizedBlogPost, Database, BlogPostMeta } from '@/types/supabase'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

type EsimProduct = Database['public']['Tables']['esim_products']['Row']
type ProductLocalizationRow = Database['public']['Tables']['product_localizations']['Row']

/**
 * 带 join 的产品行。直接 cast 成 EsimProduct 会把 join 出来的字段抹掉。
 * product_localizations 已按当前语种过滤，所以数组里最多一条。
 */
type EsimProductWithProvider = EsimProduct & {
  providers: { name: string } | null
  product_localizations: Pick<
    ProductLocalizationRow,
    'name' | 'short_description' | 'long_description' | 'seo_title' | 'seo_description' | 'usp_bullets'
  >[] | null
}

/** 产品查询统一的 select，两处列表/详情必须一致，否则详情页会少字段 */
const PRODUCT_SELECT =
  '*, providers(name), product_localizations(name, short_description, long_description, seo_title, seo_description, usp_bullets)'

/**
 * 把一行产品拍平成 LocalizedProduct。
 *
 * 文案优先级：product_localizations（关系表，可在后台逐语种编辑）
 *   → esim_products.description 这个 JSONB（老数据）
 *   → 英文兜底。
 * 名称同理：没有本地化名时退回 esim_products.name（英文原名）。
 */
function toLocalizedProduct(product: EsimProductWithProvider, locale: string): LocalizedProduct {
  const loc = product.product_localizations?.[0] ?? null
  const jsonbDescription =
    extractLocalized<string>(product.description as Record<string, string>, locale) || ''

  return {
    id: product.id,
    name: loc?.name || product.name,
    description: loc?.long_description || jsonbDescription,
    short_description: loc?.short_description ?? null,
    seo_title: loc?.seo_title ?? null,
    seo_description: loc?.seo_description ?? null,
    usp_bullets: Array.isArray(loc?.usp_bullets) ? (loc.usp_bullets as string[]) : [],
    price: product.price,
    stock: product.stock,
    country: product.country,
    validity_days: product.validity_days,
    data_label: product.data_label,
    image_url: product.image_url,
    affiliate_url: product.affiliate_url,
    provider_id: product.provider_id,
    provider_name: product.providers?.name ?? null,
    availability_status: product.availability_status,
    currency: product.currency,
    created_at: product.created_at,
    updated_at: product.updated_at,
  }
}

/**
 * blog_posts 里没有 SEO 专用列 —— 旧类型文件声明过一个，但线上库并不存在，
 * 所以这里过去读到的永远是 undefined，SEO 标题/描述实际从未生效。
 * 真实位置是 meta_data.seo（博客详情页的 generateMetadata 读的也是它）。
 */
function readPostSeo(post: BlogPost, locale: string): Record<string, string> {
  const meta = (post.meta_data as Record<string, unknown> | null) || {}
  const seo = (meta.seo as Record<string, unknown> | undefined) || {}
  // 兼容两种写法：{ title, description } 或 { en: { title }, de: { title } }
  const perLocale = (seo[locale] ?? seo['en']) as Record<string, string> | undefined
  if (perLocale && typeof perLocale === 'object') return perLocale
  return seo as Record<string, string>
}

type BlogPost = Database['public']['Tables']['blog_posts']['Row']

// ==================== Product Services ====================

/**
 * 获取所有产品（带分页和本地化）
 */
export async function getProducts(options: {
  locale: string
  page?: number
  pageSize?: number
  country?: string
}): Promise<{ data: LocalizedProduct[]; error: string | null; total: number }> {
  const { locale, page = 1, pageSize = 20, country } = options

  try {
    let query = supabase
      .from('esim_products')
      .select(PRODUCT_SELECT, { count: 'exact' })
      // 联盟模式：只展示上架的推荐位。
      // 用库里既有的 availability_status，不要另造 is_active 布尔列。
      // 允许的值只有 active / paused / sold_out / archived（库里有 CHECK 约束）。
      .eq('availability_status', 'active')
      // 只取当前语种的本地化文案。这是对嵌套表的过滤，不会把没有该语种的产品整行剔掉。
      .eq('product_localizations.locale', locale)
      .order('created_at', { ascending: false })

    // 按国家筛选
    if (country) {
      query = query.eq('country', country)
    }

    // 分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      return { data: [], error: handleSupabaseError(error), total: 0 }
    }

    if (!data) {
      return { data: [], error: null, total: 0 }
    }

    // 本地化数据
    const localizedData: LocalizedProduct[] = (data as EsimProductWithProvider[]).map((product) =>
      toLocalizedProduct(product, locale)
    )

    return { data: localizedData, error: null, total: count || 0 }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error), total: 0 }
  }
}

/**
 * 根据 ID 获取单个产品
 */
export async function getProductById(
  id: number,
  locale: string
): Promise<{ data: LocalizedProduct | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('esim_products')
      .select(PRODUCT_SELECT)
      .eq('id', id)
      // 同列表页：只取当前语种的本地化文案
      .eq('product_localizations.locale', locale)
      .single()

    if (error) {
      return { data: null, error: handleSupabaseError(error) }
    }

    if (!data) {
      return { data: null, error: 'Product not found' }
    }

    // 本地化数据
    const localizedData = toLocalizedProduct(data as EsimProductWithProvider, locale)

    return { data: localizedData, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * 订阅产品实时更新
 */
export function subscribeToProducts(
  callback: (payload: LocalizedProduct, locale: string) => void,
  locale: string
): RealtimeChannel {
  return supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'esim_products',
      },
      (payload) => {
        if (payload.new) {
          // realtime 推的是 esim_products 的原始行，没有 providers /
          // product_localizations 的 join 结果，所以本地化名和联盟商名会退回原值。
          // 需要完整数据的场景请重新走 getProductById。
          const product = {
            ...(payload.new as EsimProduct),
            providers: null,
            product_localizations: null,
          } as EsimProductWithProvider
          callback(toLocalizedProduct(product, locale), locale)
        }
      }
    )
    .subscribe()
}

// ==================== Blog Services ====================

/**
 * 获取所有已发布的博客文章（带分页和本地化）
 */
export async function getBlogPosts(options: {
  locale: string
  page?: number
  pageSize?: number
  tag?: string
  allowDraftAuthorId?: string | null
  client?: SupabaseClient<Database>
}): Promise<{ data: LocalizedBlogPost[]; error: string | null; total: number }> {
  const { locale, page = 1, pageSize = 10, tag, allowDraftAuthorId, client } = options

  try {
    const nowIso = new Date().toISOString()
    const dbClient = client || supabase
    let query = dbClient
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })

    if (allowDraftAuthorId) {
      const publishedFilter = `and(status.eq.published,published_at.not.is.null,published_at.lte.${nowIso})`
      const authorFilter = `author_id.eq.${allowDraftAuthorId}`
      query = query.or(`${publishedFilter},${authorFilter}`)
    } else {
      query = query
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .lte('published_at', nowIso)
    }

    // 按标签筛选（需要使用 PostgreSQL JSONB 查询）
    if (tag) {
      query = query.contains('tags', [tag])
    }

    // 分页
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      return { data: [], error: handleSupabaseError(error), total: 0 }
    }

    if (!data) {
      return { data: [], error: null, total: 0 }
    }

    // 本地化数据
    const localizedData: LocalizedBlogPost[] = (data as BlogPost[]).map((post) => {
      const localizedSeo = readPostSeo(post, locale)

      // 获取 published_content（已发布内容）
      const publishedContent = post.published_content as Record<string, string> | null
      const body = publishedContent?.[locale] || publishedContent?.['en'] || ''

      return {
        id: post.id,
        slug: post.slug,
        title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
        body,
        excerpt: extractLocalized<string>(post.excerpt as Record<string, string>, locale) || null,
        tags: (post.tags as string[]) || [],
        author_id: post.author_id,
        status: (post.status ?? 'draft') as LocalizedBlogPost['status'],
        published_at: post.published_at,
        featured_image: post.featured_image,
        meta_data: (post.meta_data as BlogPostMeta) || null,
        created_at: post.created_at,
        updated_at: post.updated_at,
        seo_title: localizedSeo.title || null,
        seo_description: localizedSeo.description || null,
      }
    })

    return { data: localizedData, error: null, total: count || 0 }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error), total: 0 }
  }
}

/**
 * 根据 slug 获取单个博客文章
 * @param slug - 文章 slug
 * @param locale - 语言代码
 * @param allowDraft - 是否允许获取草稿（预览模式），默认为 false
 * @param client - 可选的 Supabase 客户端（用于服务端预览模式）
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: string,
  allowDraft: boolean = false,
  client?: SupabaseClient<Database>
): Promise<{ data: LocalizedBlogPost | null; error: string | null }> {
  try {
    const nowIso = new Date().toISOString()
    const normalizedSlug = slug.replace(/^\/+/, '')
    const slugCandidates = [normalizedSlug, `/${normalizedSlug}`]
    // 如果提供了客户端（服务端），使用它；否则使用默认的客户端
    const dbClient = client || supabase
    
    let query = dbClient
      .from('blog_posts')
      .select('*')
      .in('slug', slugCandidates)
    
    // 如果不是预览模式，只获取已发布的文章
    if (!allowDraft) {
      query = query
        .eq('status', 'published')
        .not('published_at', 'is', null)
        .lte('published_at', nowIso)
    }
    
    const { data, error } = await query
      .order('published_at', { ascending: false, nullsFirst: false })
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      return { data: null, error: handleSupabaseError(error) }
    }

    if (!data) {
      return { data: null, error: 'Blog post not found' }
    }

    // 本地化数据
    const post = data as BlogPost
    const localizedSeo = readPostSeo(post, locale)

    // 根据预览模式选择内容源
    // 预览模式使用 source_content，正常模式使用 published_content
    const contentSource = allowDraft 
      ? (post.source_content as Record<string, string> | null)
      : (post.published_content as Record<string, string> | null)
    
    // 按语言获取内容。**不回退到英文** ——
    // 没有该语种的译文就不该有该语种的 URL。回退会让 /en/blog/xxx 用德语内容
    // 或空字符串顶上，等于批量生产薄内容页，而且 hreflang 还会声称它是有效的语种版本。
    // 这与落地页的原则一致：只让真实存在的 locale+slug 组合产生页面。
    const body = contentSource?.[locale]?.trim() ? contentSource[locale] : null
    
    // 如果内容缺失，返回错误
    if (!body) {
      return { data: null, error: `Content not available for locale: ${locale}` }
    }

    // 处理元数据
    const metaData = (post.meta_data as Record<string, unknown>) || null

    const localizedData: LocalizedBlogPost = {
      id: post.id,
      slug: post.slug,
      title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
      body,
      excerpt: extractLocalized<string>(post.excerpt as Record<string, string>, locale) || null,
      tags: (post.tags as string[]) || [],
      author_id: post.author_id,
      status: (post.status ?? 'draft') as LocalizedBlogPost['status'],
      published_at: post.published_at,
      featured_image: post.featured_image,
      meta_data: metaData as BlogPostMeta | null,
      created_at: post.created_at,
      updated_at: post.updated_at,
      seo_title: localizedSeo.title || null,
      seo_description: localizedSeo.description || null,
    }

    return { data: localizedData, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/**
 * 订阅博客文章实时更新
 */
export function subscribeToBlogPosts(
  callback: (payload: LocalizedBlogPost, locale: string) => void,
  locale: string
): RealtimeChannel {
  return supabase
    .channel('blog-posts-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blog_posts',
        filter: 'status=eq.published',
      },
      (payload) => {
        if (payload.new) {
          const post = payload.new as BlogPost
          const localizedSeo = readPostSeo(post, locale)

          // 获取 published_content（已发布内容）
          const publishedContent = post.published_content as Record<string, string> | null
          const body = publishedContent?.[locale] || publishedContent?.['en'] || ''

          const localizedPost: LocalizedBlogPost = {
            id: post.id,
            slug: post.slug,
            title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
            body,
            excerpt: extractLocalized<string>(post.excerpt as Record<string, string>, locale) || null,
            tags: (post.tags as string[]) || [],
            author_id: post.author_id,
            status: (post.status ?? 'draft') as LocalizedBlogPost['status'],
            published_at: post.published_at,
            featured_image: post.featured_image,
            meta_data: (post.meta_data as BlogPostMeta) || null,
            created_at: post.created_at,
            updated_at: post.updated_at,
            seo_title: localizedSeo.title || null,
            seo_description: localizedSeo.description || null,
          }
          callback(localizedPost, locale)
        }
      }
    )
    .subscribe()
}

// ==================== Landing Page Services ====================

type LandingPageRow = Database['public']['Tables']['landing_pages']['Row']

/**
 * 落地页是**按语种独立的行**（landing_pages.locale + slug 唯一），
 * 不像 blog_posts 那样一个 slug 配一份多语言 JSONB。
 * 好处是德语页可以先上线，英/中文没写就不生成 URL ——
 * 不会出现「三个语种指向同一份德语内容」这种重复内容问题。
 */
export async function getLandingPage(
  locale: string,
  slug: string
): Promise<{ data: LandingPageRow | null; error: string | null }> {
  try {
    const nowIso = new Date().toISOString()
    const normalizedSlug = slug.replace(/^\/+/, '')

    const { data, error } = await supabase
      .from('landing_pages')
      .select('*')
      .eq('locale', locale)
      .eq('slug', normalizedSlug)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', nowIso)
      .maybeSingle()

    if (error) return { data: null, error: handleSupabaseError(error) }
    if (!data) return { data: null, error: 'Landing page not found' }
    return { data: data as LandingPageRow, error: null }
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) }
  }
}

/** 已发布的全部落地页，供 generateStaticParams 和 sitemap 用 */
export async function getPublishedLandingPages(): Promise<{
  data: Pick<LandingPageRow, 'locale' | 'slug' | 'updated_at'>[]
  error: string | null
}> {
  try {
    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('landing_pages')
      .select('locale, slug, updated_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', nowIso)

    if (error) return { data: [], error: handleSupabaseError(error) }
    return { data: data ?? [], error: null }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error) }
  }
}

/** 首页「热门目的地」用：某个语种下已发布的落地页 + 国家名 */
export async function getLandingPagesForLocale(
  locale: string
): Promise<{
  data: { slug: string; h1: string; intro: string | null; countryName: string | null }[]
  error: string | null
}> {
  try {
    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('landing_pages')
      .select('slug, h1, intro, countries(name_en, name_de, name_zh)')
      .eq('locale', locale)
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', nowIso)
      .order('published_at', { ascending: false })

    if (error) return { data: [], error: handleSupabaseError(error) }

    type Row = {
      slug: string
      h1: string
      intro: string | null
      countries: { name_en: string; name_de: string | null; name_zh: string | null } | null
    }

    const rows = (data ?? []) as unknown as Row[]
    return {
      data: rows.map((row) => {
        const c = row.countries
        // countries 表存了各语种国家名，用它做卡片标题比 h1 简洁
        const countryName = c
          ? locale === 'de'
            ? c.name_de || c.name_en
            : locale === 'zh'
              ? c.name_zh || c.name_en
              : c.name_en
          : null
        return {
          slug: row.slug.replace(/^\/+/, ''),
          h1: row.h1,
          intro: row.intro,
          countryName,
        }
      }),
      error: null,
    }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error) }
  }
}

/**
 * 每篇已发布文章**实际有内容的语种**。
 *
 * blog_posts 的译文存在一个 JSONB 里（title/content 按 locale 分键），
 * 所以「这篇有没有英文版」只能看 published_content 里那个键有没有内容。
 *
 * sitemap、generateStaticParams、hreflang 都要用它 ——
 * 三者必须一致，否则会出现「sitemap 里有但页面 404」或者
 * 「hreflang 指向一个不存在的语种版本」。后者会让 Google 抓到 404，
 * 反过来伤害整组页面。
 */
export async function getPublishedPostLocales(): Promise<{
  data: { slug: string; locales: string[]; updated_at: string | null }[]
  error: string | null
}> {
  try {
    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, published_content, updated_at')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', nowIso)

    if (error) return { data: [], error: handleSupabaseError(error) }

    const rows = (data ?? []) as unknown as {
      slug: string
      published_content: Record<string, string> | null
      updated_at: string | null
    }[]

    return {
      data: rows
        .map((row) => ({
          slug: row.slug.replace(/^\/+/, ''),
          locales: Object.entries(row.published_content ?? {})
            .filter(([lng, body]) => languages.includes(lng) && String(body ?? '').trim().length > 0)
            .map(([lng]) => lng),
          updated_at: row.updated_at,
        }))
        .filter((row) => row.slug.length > 0 && row.locales.length > 0),
      error: null,
    }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error) }
  }
}

/**
 * 已发布文章里出现的图片，供 sitemap 的 <image:> 扩展用。
 *
 * Google 明确说图片站点地图能帮它发现「可能遗漏的图片」，
 * 而对内容站来说图片搜索是一条独立的流量来源。
 *
 * 图片来自两处：文章头图 featured_image，以及正文里的 <Figure src="…" />。
 * 只取当前语种真实有内容的文章 —— 和 sitemap 其余部分保持一致。
 */
export async function getPublishedPostImages(): Promise<{
  data: { slug: string; locale: string; images: { url: string; caption: string }[] }[]
  error: string | null
}> {
  try {
    const nowIso = new Date().toISOString()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug, featured_image, published_content')
      .eq('status', 'published')
      .not('published_at', 'is', null)
      .lte('published_at', nowIso)

    if (error) return { data: [], error: handleSupabaseError(error) }

    const rows = (data ?? []) as unknown as {
      slug: string
      featured_image: string | null
      published_content: Record<string, string> | null
    }[]

    const out: { slug: string; locale: string; images: { url: string; caption: string }[] }[] = []

    for (const row of rows) {
      const slug = row.slug.replace(/^\/+/, '')
      if (!slug) continue

      for (const [locale, body] of Object.entries(row.published_content ?? {})) {
        if (!languages.includes(locale) || !String(body ?? '').trim()) continue

        const images: { url: string; caption: string }[] = []
        if (row.featured_image?.startsWith('http')) {
          images.push({ url: row.featured_image, caption: '' })
        }

        // <Figure src="…" alt="…" /> —— alt 拿来当 <image:caption>
        const figureRe = /<Figure\b[^>]*?src=["']([^"']+)["'][^>]*?>/g
        let m: RegExpExecArray | null
        while ((m = figureRe.exec(String(body))) !== null) {
          const url = m[1]
          if (!url?.startsWith('http')) continue
          const alt = /alt=["']([^"']*)["']/.exec(m[0])?.[1] ?? ''
          if (!images.some((img) => img.url === url)) images.push({ url, caption: alt })
        }

        if (images.length > 0) out.push({ slug, locale, images })
      }
    }

    return { data: out, error: null }
  } catch (error) {
    return { data: [], error: handleSupabaseError(error) }
  }
}
