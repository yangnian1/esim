import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 环境变量验证
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// 创建 Supabase 客户端
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

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
  return 'An unknown error occurred'
}
