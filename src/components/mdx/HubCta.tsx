import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * 正文里指向枢纽页的行动引导。
 *
 * 为什么要做成组件而不是用普通引用块：
 * 内链的价值不只是给爬虫传权重，也在于**真的有人点**。
 * 灰色的 blockquote 和正文里其他引用长得一样，读者会直接略过。
 *
 * 每篇辐条文章都应该有一个，锚文本用枢纽页的目标关键词
 * （见 web/docs/SEO-STRUCTURE.md 第 4 节的内链规则）。
 *
 * 在 Markdown 正文里这样写：
 *
 *   <HubCta href="/de/esim-tuerkei" label="eSIM Türkei Übersicht">
 *   Alle Tarife im Vergleich – Preise und Laufzeiten auf einen Blick.
 *   </HubCta>
 */
interface HubCtaProps {
  /** 枢纽页地址，必须带语言前缀 */
  href: string
  /** 链接文字 —— 用枢纽页的目标关键词，不要写「点这里」 */
  label: string
  /** 上方的说明文字 */
  children?: ReactNode
}

export function HubCta({ href, label, children }: HubCtaProps) {
  return (
    <div className="not-prose my-8 rounded-2xl border border-[#0EA5E9]/30 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
      {children && <div className="mb-4 text-gray-700">{children}</div>}
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-lg bg-[#0EA5E9] px-5 py-3 font-medium text-white no-underline shadow-sm transition-colors hover:bg-[#0284C7]"
      >
        {label}
        <span
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        >
          →
        </span>
      </Link>
    </div>
  )
}
