import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com').replace(/\/$/, '')

  // 注意路径都带语言前缀（/de/blog/… 等），
  // 所以要写成 /*/xxx，直接写 /xxx 是匹配不到的。
  //
  // 2026-08-26 去掉了 /*/orders 和 /*/auth/ ——
  // 那两个页面已经删除（前台不再有用户体系，也没有站内订单），
  // 给不存在的路径写 disallow 只会让 robots.txt 越积越乱。
  const disallow = [
    '/api/',             // 含 /api/go 出站跳转，不该进抓取队列
    '/_next/',
    '/*/blog/*/preview', // 草稿预览，没有 token 只会看到未授权提示
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
