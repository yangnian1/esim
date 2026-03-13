import { supabase, extractLocalized, handleSupabaseError } from './supabase'
import type { LocalizedProduct, LocalizedBlogPost, Database, BlogPostMeta } from '@/types/supabase'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

type EsimProduct = Database['public']['Tables']['esim_products']['Row']
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
      .select('*', { count: 'exact' })
      .gte('stock', 0) // 只显示有库存的产品
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
    const localizedData: LocalizedProduct[] = (data as EsimProduct[]).map((product) => ({
      id: product.id,
      name: product.name,
      description: extractLocalized<string>(product.description as Record<string, string>, locale) || '',
      price: product.price,
      stock: product.stock,
      country: product.country,
      validity_days: product.validity_days,
      image_url: product.image_url,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }))

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
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return { data: null, error: handleSupabaseError(error) }
    }

    if (!data) {
      return { data: null, error: 'Product not found' }
    }

    // 本地化数据
    const product = data as EsimProduct
    const localizedData: LocalizedProduct = {
      id: product.id,
      name: product.name,
      description: extractLocalized<string>(product.description as Record<string, string>, locale) || '',
      price: product.price,
      stock: product.stock,
      country: product.country,
      validity_days: product.validity_days,
      image_url: product.image_url,
      created_at: product.created_at,
      updated_at: product.updated_at,
    }

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
          const product = payload.new as EsimProduct
          const localizedProduct: LocalizedProduct = {
            id: product.id,
            name: product.name,
            description: extractLocalized<string>(product.description as Record<string, string>, locale) || '',
            price: product.price,
            stock: product.stock,
            country: product.country,
            validity_days: product.validity_days,
            image_url: product.image_url,
            created_at: product.created_at,
            updated_at: product.updated_at,
          }
          callback(localizedProduct, locale)
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
      const seoMeta = (post.seo_meta as Record<string, unknown>) || {}
      const localizedSeo = (seoMeta[locale] || seoMeta['en'] || {}) as Record<string, string>

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
        status: post.status,
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
    const seoMeta = (post.seo_meta as Record<string, unknown>) || {}
    const localizedSeo = (seoMeta[locale] || seoMeta['en'] || {}) as Record<string, string>

    // 根据预览模式选择内容源
    // 预览模式使用 source_content，正常模式使用 published_content
    const contentSource = allowDraft 
      ? (post.source_content as Record<string, string> | null)
      : (post.published_content as Record<string, string> | null)
    
    // 按语言获取内容，如果缺失则返回 null（触发 404）
    const body = contentSource?.[locale] || contentSource?.['en'] || null
    
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
      status: post.status,
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
          const seoMeta = (post.seo_meta as Record<string, unknown>) || {}
          const localizedSeo = (seoMeta[locale] || seoMeta['en'] || {}) as Record<string, string>

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
            status: post.status,
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
