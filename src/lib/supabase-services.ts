import { supabase, extractLocalized, handleSupabaseError } from './supabase'
import type { LocalizedProduct, LocalizedBlogPost, Database, ContentBlock, BlogPostMeta } from '@/types/supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

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
}): Promise<{ data: LocalizedBlogPost[]; error: string | null; total: number }> {
  const { locale, page = 1, pageSize = 10, tag } = options

  try {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })

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

      // 处理内容：支持新的块级结构和旧格式（向后兼容）
      const contentData = post.content as Record<string, unknown>
      let localizedContent: ContentBlock[] | string = ''
      
      if (contentData && typeof contentData === 'object') {
        const localeContent = contentData[locale] || contentData['en']
        if (Array.isArray(localeContent)) {
          localizedContent = localeContent as ContentBlock[]
        } else if (typeof localeContent === 'string') {
          localizedContent = localeContent
        } else {
          localizedContent = extractLocalized<string>(contentData as Record<string, string>, locale) || ''
        }
      } else {
        localizedContent = extractLocalized<string>(post.content as Record<string, string>, locale) || ''
      }

      return {
        id: post.id,
        slug: post.slug,
        title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
        content: localizedContent,
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
 */
export async function getBlogPostBySlug(
  slug: string,
  locale: string
): Promise<{ data: LocalizedBlogPost | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

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

    // 处理内容：支持新的块级结构和旧格式（向后兼容）
    const contentData = post.content as Record<string, unknown>
    let localizedContent: ContentBlock[] | string = ''
    
    if (contentData && typeof contentData === 'object') {
      const localeContent = contentData[locale] || contentData['en']
      
      // 如果是数组，说明是新格式（块级结构）
      if (Array.isArray(localeContent)) {
        localizedContent = localeContent as ContentBlock[]
      } 
      // 如果是字符串，说明是旧格式
      else if (typeof localeContent === 'string') {
        localizedContent = localeContent
      }
      // 如果都没有，尝试提取字符串
      else {
        localizedContent = extractLocalized<string>(contentData as Record<string, string>, locale) || ''
      }
    } else {
      // 向后兼容：如果 content 是字符串格式
      localizedContent = extractLocalized<string>(post.content as Record<string, string>, locale) || ''
    }

    // 处理元数据
    const metaData = (post.meta_data as Record<string, unknown>) || null

    const localizedData: LocalizedBlogPost = {
      id: post.id,
      slug: post.slug,
      title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
      content: localizedContent,
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

          // 处理内容：支持新的块级结构和旧格式（向后兼容）
          const contentData = post.content as Record<string, unknown>
          let localizedContent: ContentBlock[] | string = ''
          
          if (contentData && typeof contentData === 'object') {
            const localeContent = contentData[locale] || contentData['en']
            if (Array.isArray(localeContent)) {
              localizedContent = localeContent as ContentBlock[]
            } else if (typeof localeContent === 'string') {
              localizedContent = localeContent
            } else {
              localizedContent = extractLocalized<string>(contentData as Record<string, string>, locale) || ''
            }
          } else {
            localizedContent = extractLocalized<string>(post.content as Record<string, string>, locale) || ''
          }

          const localizedPost: LocalizedBlogPost = {
            id: post.id,
            slug: post.slug,
            title: extractLocalized<string>(post.title as Record<string, string>, locale) || '',
            content: localizedContent,
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
