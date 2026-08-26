import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './i18n/settings'

acceptLanguage.languages(languages)

/**
 * 只做一件事：给没有语言前缀的路径补上语言前缀。
 *
 * 历史上它还负责用 @supabase/ssr 刷新会话 cookie —— 前台去掉登录功能后
 * 那部分已经删掉了。删掉的直接收益：博客列表页不再需要读会话，可以静态化。
 *
 * ⚠️ 语言判定顺序不能改：cookie → Accept-Language → 兜底语种。
 * cookie 优先是为了尊重用户手动切换过的语种。
 */
export const config = {
  // 排除静态资源、API 路由和 SEO 文件
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml|.+\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
}

export function middleware(req: NextRequest) {
  const response = NextResponse.next({ request: req })

  let lng: string | null = null
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  const excludePaths = ['/_next', '/api', '/robots.txt', '/sitemap.xml']
  const shouldExclude = excludePaths.some((path) => req.nextUrl.pathname.startsWith(path))

  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !shouldExclude
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  // 记住用户实际浏览的语种，下次直接用
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
  }

  return response
}
