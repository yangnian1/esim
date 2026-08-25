'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { languages, fallbackLng } from '@/i18n/settings'
import { Compass, ArrowRight } from 'lucide-react'

/**
 * 404 页面的正文，被两个地方复用：
 *   - app/[lng]/not-found.tsx        —— 段内 notFound() 触发，外面有 Header/Footer
 *   - app/global-not-found.tsx       —— 完全没匹配上的 URL，绕过布局，没有 Header/Footer
 *
 * 为什么是客户端组件：not-found 拿不到 params，只能从 usePathname() 解析语种。
 *
 * 设计上不只是「告诉你没找到」——404 是一次已经发生的访问，
 * 直接把人送去落地页和产品页，比让他关掉标签页强。
 */

const COPY: Record<
  string,
  {
    code: string
    title: string
    desc: string
    home: string
    products: string
    blog: string
    destinations: string
  }
> = {
  de: {
    code: 'Seite nicht gefunden',
    title: 'Diese Seite gibt es nicht (mehr)',
    desc: 'Vielleicht hat sich die Adresse geändert oder es hat sich ein Tippfehler eingeschlichen. Hier geht es weiter:',
    home: 'Zur Startseite',
    products: 'eSIM-Tarife ansehen',
    blog: 'Zum Ratgeber',
    destinations: 'Beliebte Reiseziele',
  },
  en: {
    code: 'Page not found',
    title: "This page doesn't exist",
    desc: 'The address may have changed, or there might be a typo. Here is where to go next:',
    home: 'Go to homepage',
    products: 'Browse eSIM plans',
    blog: 'Read the guides',
    destinations: 'Popular destinations',
  },
  zh: {
    code: '页面未找到',
    title: '这个页面不存在',
    desc: '可能是地址变更了，或者链接里有笔误。你可以从这里继续：',
    home: '回到首页',
    products: '查看 eSIM 套餐',
    blog: '阅读指南',
    destinations: '热门目的地',
  },
}

/** 从 /de/blog/xxx 这样的路径里取出语种；取不到就用兜底语种 */
function localeFromPath(pathname: string | null): string {
  const first = (pathname ?? '').split('/').filter(Boolean)[0]
  return first && languages.includes(first) ? first : fallbackLng
}

export function NotFoundContent() {
  const lng = localeFromPath(usePathname())
  const t = COPY[lng] ?? COPY[fallbackLng]

  const [destinations, setDestinations] = useState<{ slug: string; label: string }[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // landing_pages 对匿名是只读放行的，客户端直接查即可
      const { data } = await supabase
        .from('landing_pages')
        .select('slug, h1, countries(name_en, name_de, name_zh)')
        .eq('locale', lng)
        .eq('status', 'published')
        .limit(6)

      if (cancelled || !data) return

      type Row = {
        slug: string
        h1: string
        countries: { name_en: string; name_de: string | null; name_zh: string | null } | null
      }
      setDestinations(
        (data as unknown as Row[]).map((row) => {
          const c = row.countries
          const label = c
            ? lng === 'de'
              ? c.name_de || c.name_en
              : lng === 'zh'
                ? c.name_zh || c.name_en
                : c.name_en
            : row.h1
          return { slug: row.slug.replace(/^\/+/, ''), label }
        })
      )
    })()
    return () => {
      cancelled = true
    }
  }, [lng])

  return (
    <main className="min-h-[70vh] bg-gradient-to-b from-blue-50 to-white flex items-center">
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <p className="text-[6rem] md:text-[8rem] font-bold leading-none text-[#0EA5E9]/20 select-none">
          404
        </p>
        <p className="-mt-6 text-sm font-medium uppercase tracking-widest text-[#0EA5E9]">
          {t.code}
        </p>

        <h1 className="mt-6 text-2xl md:text-4xl font-bold text-[#0C4A6E]">{t.title}</h1>
        <p className="mt-4 text-gray-600 max-w-xl mx-auto">{t.desc}</p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            href={`/${lng}`}
            className="rounded-lg bg-[#0EA5E9] px-6 py-3 text-white font-medium shadow hover:bg-[#0284C7] transition-colors"
          >
            {t.home}
          </Link>
          <Link
            href={`/${lng}/products`}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
          >
            {t.products}
          </Link>
          <Link
            href={`/${lng}/blog`}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
          >
            {t.blog}
          </Link>
        </div>

        {destinations.length > 0 && (
          <div className="mt-14 border-t border-blue-100 pt-10">
            <p className="flex items-center justify-center gap-2 text-sm font-semibold text-[#0C4A6E]">
              <Compass className="h-4 w-4 text-[#0EA5E9]" />
              {t.destinations}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {destinations.map((d) => (
                <Link
                  key={d.slug}
                  href={`/${lng}/${d.slug}`}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-colors"
                >
                  {d.label}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
