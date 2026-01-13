import { supabase } from './supabase'
import type { Profile } from '@/types/supabase'

// ==================== 认证服务 ====================

/**
 * 用户注册
 */
export async function signUp(email: string, password: string, username?: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0], // 默认用邮箱前缀作为用户名
        },
      },
    })

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: data.user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 用户登录
 */
export async function signIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { user: null, session: null, error: error.message }
    }

    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    return { user: null, session: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 用户登出
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 获取当前用户（客户端使用）
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}


/**
 * 获取当前用户的 Profile
 */
export async function getCurrentUserProfile(): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { profile: null, error: authError?.message || 'Not authenticated' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { profile: null, error: profileError.message }
    }

    return { profile, error: null }
  } catch (error) {
    return { profile: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 更新用户 Profile
 */
export async function updateProfile(updates: {
  username?: string
  avatar_url?: string
}): Promise<{ profile: Profile | null; error: string | null }> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { profile: null, error: authError?.message || 'Not authenticated' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: profile, error: updateError } = await (supabase.from('profiles') as any)
      .update({
        username: updates.username,
        avatar_url: updates.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      return { profile: null, error: updateError.message }
    }

    return { profile, error: null }
  } catch (error) {
    return { profile: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 重置密码（发送重置邮件）
 */
export async function resetPassword(email: string) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * 更新密码
 */
export async function updatePassword(newPassword: string) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { error: error.message }
    }

    return { error: null }
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
