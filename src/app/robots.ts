import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com').replace(/\/$/, '')

  // 注意路径都带语言前缀（/en/orders、/de/orders …），
  // 所以必须写成 /*/orders，直接写 /orders/ 是匹配不到的。
  const disallow = [
    '/api/',      // 含 /api/go 出站跳转，不该进抓取队列
    '/_next/',
    '/*/orders',  // 联盟模式下的历史占位页，无内容
    '/*/auth/',   // 登录/注册，对搜索引擎无价值
    '/*/blog/*/preview', // 草稿预览，非作者访问只会看到未授权提示
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
