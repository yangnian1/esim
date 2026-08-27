import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, retiredLanguages, cookieName } from './i18n/settings'

acceptLanguage.languages(languages)

/**
 * 做两件事：
 * 1. 把下线语种的前缀（/en /zh）重定向回当前语种；
 * 2. 给没有语言前缀的路径补上语言前缀。
 *
 * ⚠️ 第 1 步必须在第 2 步之前，而且不能省。
 * 第 2 步的判断是「路径不以任何**启用中**的语种开头就补前缀」——
 * languages 收窄到只剩 de 之后，/en/products 不以 /de 开头，
 * 会被拼成 /de/en/products，直接 404。
 *
 * 历史上这里还负责用 @supabase/ssr 刷新会话 cookie —— 前台去掉登录功能后
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
  const { pathname } = req.nextUrl

  // 下线语种 → 当前语种。用 307 而不是 308：这是个「前期先只做德语」的
  // 可逆决定，而 308 会被浏览器**永久缓存**，将来把英语加回来时，
  // 访问过旧 URL 的人会一直被弹回德语页。站点还没进索引，
  // 也没有需要靠 301 传递的权重，所以临时跳转是更合适的一侧。
  const retired = retiredLanguages.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  )
  if (retired) {
    const rest = pathname.slice(`/${retired}`.length) || '/'
    const url = req.nextUrl.clone()
    url.pathname = `/${fallbackLng}${rest === '/' ? '' : rest}`
    return NextResponse.redirect(url, 307)
  }

  const response = NextResponse.next({ request: req })

  let lng: string | null = null
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  const excludePaths = ['/_next', '/api', '/robots.txt', '/sitemap.xml']
  const shouldExclude = excludePaths.some((path) => pathname.startsWith(path))

  if (
    !languages.some((loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)) &&
    !shouldExclude
  ) {
    // pathname 为 '/' 时不要拼成 '/de/' —— Next 会再 308 到 '/de'，
    // 首页白白多跳一次
    return NextResponse.redirect(new URL(`/${lng}${pathname === '/' ? '' : pathname}`, req.url))
  }

  // 记住用户实际浏览的语种，下次直接用
  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
  }

  return response
}
