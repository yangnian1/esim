import { createServerClient as createSupabaseServerClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { cookies } from 'next/headers'

// 环境变量
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 创建服务端 Supabase 客户端（用于服务端组件）
// 使用 @supabase/ssr 正确处理 cookies
export async function createServerClient() {
  const cookieStore = await cookies()

  return createSupabaseServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // 在服务端组件中调用 setAll 时可能会失败
          // 这是正常的，因为服务端组件无法设置 cookies
          // 只有在 Server Actions 或 Route Handlers 中才能设置
        }
      },
    },
  })
}

// 服务端获取当前用户
export async function getCurrentUserServer() {
  try {
    const serverClient = await createServerClient()
    const { data: { user }, error } = await serverClient.auth.getUser()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

