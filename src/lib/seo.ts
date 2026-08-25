import type { Metadata } from 'next'
import { languages, fallbackLng } from '@/i18n/settings'

/**
 * 站内页面的 canonical / hreflang 统一入口。
 *
 * 为什么要集中：这套逻辑有两个容易写错的地方，散在各页面里迟早写歪。
 *  1. 没配 NEXT_PUBLIC_SITE_URL 时**必须整段不输出**，
 *     而不是退回一个占位域名 —— 错的 canonical 比没有 canonical 伤害大得多。
 *  2. hreflang 必须包含自身语种，并且要带 x-default。
 *
 * 只适用于「每个语种都存在」的固定页面（首页、列表页、关于/联系）。
 * 落地页那种「某些语种根本没有对应行」的情况不能用这个 ——
 * 它会声明出不存在的 URL，Google 抓到 404 反而伤害整组页面。
 */
export function buildAlternates(path: (lng: string) => string): Metadata['alternates'] | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  if (!siteUrl) return undefined

  return {
    languages: {
      ...Object.fromEntries(languages.map((l) => [l, `${siteUrl}${path(l)}`])),
      'x-default': `${siteUrl}${path(fallbackLng)}`,
    },
  }
}

interface PageMetadataInput {
  lng: string
  /** 当前页在各语种下的路径，如 (l) => `/${l}/products` */
  path: (lng: string) => string
  /** 逐语种文案，key 是 locale；取不到时回退 fallbackLng */
  copy: Record<string, { title: string; description: string }>
}

/**
 * 生成固定页面的完整 metadata：本地化 title/description + canonical + hreflang + openGraph。
 *
 * 这些页面原来一个 metadata 都没有，全部继承根 layout 那一份英文标题，
 * 结果 4 个页面 × 3 语种 = 12 个 URL 共用同一个 title —— 对多语种站是致命的。
 */
export function buildPageMetadata({ lng, path, copy }: PageMetadataInput): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const text = copy[lng] ?? copy[fallbackLng]
  const alternates = buildAlternates(path)
  const canonical = siteUrl ? `${siteUrl}${path(lng)}` : undefined

  return {
    title: text.title,
    description: text.description,
    alternates: alternates ? { ...alternates, ...(canonical ? { canonical } : {}) } : undefined,
    openGraph: {
      type: 'website',
      title: text.title,
      description: text.description,
      url: canonical,
      locale: lng,
    },
  }
}
