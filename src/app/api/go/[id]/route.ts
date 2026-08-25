import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { fallbackLng, languages } from '@/i18n/settings'

/**
 * 联盟出站跳转：/api/go/{productId}?lng=de
 *
 * 内容页与产品卡上的 CTA 一律指向这里，而不是直接写联盟商链接，这样：
 *  - 换联盟商 / 换追踪参数只改数据库，不用回头改任何已发布的文章；
 *  - 联盟链接不出现在 HTML 里，减少被抓取和被竞品扒站的面；
 *  - robots.ts 已经 disallow /api/，出站链接天然不进抓取队列。
 *
 * 注意：调用方仍然要在 <a> 上写 rel="sponsored nofollow noopener"，
 * 这是给爬虫看的声明，跟本路由是否被抓取无关。
 */

// 跳转结果依赖数据库当前值，不能被静态化或缓存
export const dynamic = 'force-dynamic'

function resolveLng(raw: string | null): string {
  return raw && languages.includes(raw) ? raw : fallbackLng
}

// 明显的爬虫不计入点击，否则联盟数据会被抓取流量灌水。
// robots.txt 已经 disallow /api/，但不是所有爬虫都守规矩。
const BOT_UA = /bot|crawler|spider|crawling|slurp|bingpreview|headless|lighthouse|curl|wget|python-requests|axios|node-fetch/i

/**
 * 只保留来源页的路径，丢掉 query。
 * 站外来源保留 host，站内只留 path —— query 里可能带用户输入或第三方参数，不该落库。
 */
function normalizeReferrer(referer: string | null, selfOrigin: string): string | null {
  if (!referer) return null
  try {
    const url = new URL(referer)
    return url.origin === selfOrigin ? url.pathname : `${url.host}${url.pathname}`
  } catch {
    return null
  }
}

/** 从来源路径里提取 slug：/de/blog/esim-tuerkei -> esim-tuerkei */
function slugFromPath(path: string | null): string | null {
  if (!path || !path.startsWith('/')) return null
  const parts = path.split('/').filter(Boolean)
  // 首段是语言前缀，去掉后取最后一段
  const rest = languages.includes(parts[0]) ? parts.slice(1) : parts
  return rest.length > 0 ? rest[rest.length - 1] : null
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { searchParams } = new URL(request.url)
  const lng = resolveLng(searchParams.get('lng'))

  // 任何异常情况都退回产品列表页，而不是抛 404 ——
  // 用户是从内容页点过来的，落到一个能继续浏览的页面比看到错误页好。
  const fallback = () => {
    const res = NextResponse.redirect(new URL(`/${lng}/products`, request.url), 302)
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  const productId = Number(id)
  if (!Number.isInteger(productId) || productId <= 0) {
    return fallback()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[go] 缺少 Supabase 环境变量')
    return fallback()
  }

  // 只读公开数据，不需要会话
  const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data, error } = await supabase
    .from('esim_products')
    .select('affiliate_url, availability_status, affiliate_program_id')
    .eq('id', productId)
    .single()

  if (error || !data || data.availability_status !== 'active' || !data.affiliate_url) {
    return fallback()
  }

  // 防御性校验：affiliate_url 是后台手填的，挡掉 javascript: 之类的协议
  let target: URL
  try {
    target = new URL(data.affiliate_url)
  } catch {
    console.error(`[go] 产品 ${productId} 的 affiliate_url 不是合法 URL`)
    return fallback()
  }
  if (target.protocol !== 'https:' && target.protocol !== 'http:') {
    console.error(`[go] 产品 ${productId} 的 affiliate_url 协议非法: ${target.protocol}`)
    return fallback()
  }

  // 可选的 sub-id 归因：不同联盟商的参数名不一样（sub_id / aff_sub / subId ...），
  // 通过环境变量指定，没配就原样跳转。值用「语种-产品」便于分语种看转化。
  const subidParam = process.env.AFFILIATE_SUBID_PARAM
  if (subidParam) {
    target.searchParams.set(subidParam, `${lng}-${productId}`)
  }

  const res = NextResponse.redirect(target.toString(), 302)
  res.headers.set('Cache-Control', 'no-store')

  // 埋点放在 after() 里：响应已经发出去了才写库，
  // 用户不会为这次 insert 多等一个 RTT，写失败也不影响跳转。
  const userAgent = request.headers.get('user-agent')
  if (!userAgent || !BOT_UA.test(userAgent)) {
    const referrerPath = normalizeReferrer(
      request.headers.get('referer'),
      new URL(request.url).origin
    )
    after(async () => {
      try {
        const { error: insertError } = await supabase.from('affiliate_clicks').insert({
          product_id: productId,
          affiliate_program_id: data.affiliate_program_id,
          locale: lng,
          referrer: referrerPath,
          landing_page_slug: slugFromPath(referrerPath),
          // UA 只用来区分设备大类和过滤爬虫，截断到 255 避免超长串
          user_agent: userAgent ? userAgent.slice(0, 255) : null,
          utm_source: searchParams.get('utm_source'),
          utm_medium: searchParams.get('utm_medium'),
          utm_campaign: searchParams.get('utm_campaign'),
          // session_id 故意留空：填它需要在设备上种一个持久标识，
          // 在德国要过 TTDSG/GDPR 的同意墙。要做请先接同意管理，别偷偷种 cookie。
          session_id: null,
        })
        if (insertError) {
          console.error('[go] 点击埋点写入失败:', insertError.message)
        }
      } catch (err) {
        console.error('[go] 点击埋点异常:', err)
      }
    })
  }

  return res
}
