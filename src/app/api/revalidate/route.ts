import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { languages } from '@/i18n/settings'

/**
 * 刷新前台缓存。admin 改完内容后调它。
 *
 * 鉴权用共享密钥而不是用户会话 —— 前台已经没有登录功能了，
 * 而且这本来就是机器对机器的调用，密钥比会话更合适。
 *
 *   POST /api/revalidate
 *   Authorization: Bearer <REVALIDATE_SECRET>
 *
 * 没配 REVALIDATE_SECRET 时直接拒绝：宁可用不了，
 * 也不能让一个未配置的部署变成任何人都能触发的全站重建接口。
 */
export const dynamic = 'force-dynamic'

/** 定长比较，避免用 === 比较密钥时的计时差异 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    console.error('[revalidate] 未配置 REVALIDATE_SECRET，接口不可用')
    return NextResponse.json({ ok: false, error: 'Not configured' }, { status: 503 })
  }

  const header = request.headers.get('authorization') ?? ''
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length).trim() : ''
  if (!token || !safeEqual(token, secret)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ ok: false, error: 'Missing Supabase env' }, { status: 500 })
  }

  // 只读已发布文章，anon key 足够（RLS 的 public read 策略允许）
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const nowIso = new Date().toISOString()
  const { data: rows, error } = await supabase
    .from('blog_posts')
    .select('slug, published_content')
    .eq('status', 'published')
    .not('published_at', 'is', null)
    .lte('published_at', nowIso)

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  let paths = 0

  // sitemap 也要刷 —— 新文章的 URL 在这里，不刷的话搜索引擎要等到
  // 下次部署才看得到它。robots.txt 不用刷，它不读数据库。
  revalidatePath('/sitemap.xml')
  paths += 1

  for (const lng of languages) {
    revalidatePath(`/${lng}/blog`)
    paths += 1
  }

  // 只刷新真实存在的 locale+slug 组合，和 sitemap / generateStaticParams 保持一致
  for (const row of rows ?? []) {
    const slug = String(row.slug).replace(/^\/+/, '')
    if (!slug) continue
    const content = (row.published_content ?? {}) as Record<string, string>
    for (const lng of languages) {
      if (!String(content[lng] ?? '').trim()) continue
      revalidatePath(`/${lng}/blog/${slug}`)
      paths += 1
    }
  }

  return NextResponse.json({ ok: true, revalidated: paths, at: new Date().toISOString() })
}
