import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database, LocalizedBlogPost, LocalizedProduct } from '@/types/supabase'
import { getBlogPostBySlug, getBlogPosts, getProducts } from '@/lib/supabase-services'

export async function getPublishedPosts(
  locale: string,
  pageSize: number = 20,
  options?: {
    allowDraftAuthorId?: string | null
    client?: SupabaseClient<Database>
  }
): Promise<{ data: LocalizedBlogPost[]; error: string | null; total: number }> {
  return getBlogPosts({
    locale,
    pageSize,
    allowDraftAuthorId: options?.allowDraftAuthorId ?? null,
    client: options?.client,
  })
}

export async function getPostBySlug(
  locale: string,
  slug: string,
  options?: {
    allowDraft?: boolean
    client?: SupabaseClient<Database>
  }
): Promise<{ data: LocalizedBlogPost | null; error: string | null }> {
  return getBlogPostBySlug(slug, locale, options?.allowDraft ?? false, options?.client)
}

export async function getTurkeyPlans(
  locale: string,
  pageSize: number = 12
): Promise<{ data: LocalizedProduct[]; error: string | null; total: number }> {
  return getProducts({ locale, pageSize, country: 'Turkey' })
}
