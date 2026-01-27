import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建浏览器客户端（用于客户端组件）
// 使用 @supabase/ssr 可以自动将会话存储到 cookies 中
export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

// 导出配置供服务端使用
export { supabaseUrl, supabaseAnonKey }

// 辅助函数：从 JSONB 中提取指定语言的内容
export function extractLocalized<T = string>(
  jsonb: Record<string, T> | null | undefined,
  locale: string,
  fallbackLocale: string = 'en'
): T | null {
  if (!jsonb) return null
  return jsonb[locale] ?? jsonb[fallbackLocale] ?? null
}

// 辅助函数：获取 Supabase Storage 公共 URL
export function getStorageUrl(bucket: string, path: string): string {
  if (!path) return '/placeholder.png'
  if (path.startsWith('http')) return path

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}

// 辅助函数：处理 Supabase 错误
export function handleSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message
    if (typeof message === 'string' && message.trim().length > 0) {
      return message
    }
  }
  return 'An unknown error occurred'
}
