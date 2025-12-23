import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './i18n/settings'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  // 排除静态资源：API路由、Next.js内部文件、图片文件、SEO文件等
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml|.+\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

export function middleware(req: NextRequest) {
  let lng
  if (req.cookies.has(cookieName)) lng = acceptLanguage.get(req.cookies.get(cookieName)?.value)
  if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  // Redirect if lng in path is not supported
  // 排除 SEO 文件和 Next.js 内部路径
  const excludePaths = ['/_next', '/api', '/robots.txt', '/sitemap.xml']
  const shouldExclude = excludePaths.some(path => req.nextUrl.pathname.startsWith(path))

  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !shouldExclude
  ) {
    return NextResponse.redirect(new URL(`/${lng}${req.nextUrl.pathname}`, req.url))
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
} 