import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages, cookieName } from './i18n/settings'
import { createServerClient } from '@supabase/ssr'

acceptLanguage.languages(languages)

export const config = {
  // matcher: '/:lng*'
  // 排除静态资源：API路由、Next.js内部文件、图片文件、SEO文件等
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt|sitemap.xml|.+\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)']
}

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: req,
  })

  // 创建 Supabase 客户端，用于刷新会话
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          response = NextResponse.next({
            request: req,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 刷新会话（如果存在）- 这会自动更新 cookies 中的 token
  await supabase.auth.getUser()

  // 处理语言逻辑
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
    const redirectUrl = new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    return NextResponse.redirect(redirectUrl)
  }

  if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer') as string)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
  }

  return response
} 