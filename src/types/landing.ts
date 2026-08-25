/**
 * 落地页内容模型（landing_pages.content 这个 JSONB 的形状）。
 *
 * 目标：新增一个国家的落地页只需要往 landing_pages 插一行，不用写任何代码。
 * 所以这里的 section 类型是一个封闭的枚举 —— 渲染器认识哪些 type，
 * 运营就只能用哪些 type。加新版式要同时改这里和 LandingSections.tsx。
 *
 * 存进库的是未知结构的 JSON，所有解析都要防御性处理：
 * 内容是人在后台填的，字段缺失、类型不对都可能发生，不能让整页崩掉。
 */

export interface LandingLink {
  label: string
  href: string
}

/** 卡片组：用于「按行程长度推荐」这类并列内容 */
export interface CardsSection {
  type: 'cards'
  heading?: string
  items: Array<{
    title: string
    desc?: string
    note?: string
    cta?: LandingLink
  }>
}

/** 产品对比表：按国家从 esim_products 实时取，不写死在内容里 */
export interface ProductsSection {
  type: 'products'
  heading?: string
  /** 对应 esim_products.country */
  country: string
  anchor?: string
}

/** 富文本段落，支持每段一个加粗前缀 */
export interface RichTextSection {
  type: 'richtext'
  heading?: string
  paragraphs: Array<{ strong?: string; text: string }>
}

/** 步骤组：如「出发前 / 抵达后」 */
export interface StepsSection {
  type: 'steps'
  heading?: string
  groups: Array<{ title: string; items: string[] }>
  footnote?: string
}

/** 高亮提示块 */
export interface CalloutSection {
  type: 'callout'
  heading?: string
  text: string
  link?: LandingLink
}

/** 页尾行动号召 */
export interface CtaSection {
  type: 'cta'
  heading?: string
  text?: string
  cta?: LandingLink
}

export type LandingSection =
  | CardsSection
  | ProductsSection
  | RichTextSection
  | StepsSection
  | CalloutSection
  | CtaSection

export interface LandingHero {
  cta?: LandingLink
  bullets?: string[]
}

export interface LandingContent {
  hero?: LandingHero
  sections?: LandingSection[]
}

export interface LandingFaq {
  q: string
  a: string
}

const SECTION_TYPES = ['cards', 'products', 'richtext', 'steps', 'callout', 'cta'] as const

/** 把库里的 JSONB 收窄成 LandingContent，任何不认识的东西直接丢掉而不是抛错 */
export function parseLandingContent(raw: unknown): LandingContent {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const obj = raw as Record<string, unknown>

  const hero = (() => {
    const h = obj.hero
    if (!h || typeof h !== 'object' || Array.isArray(h)) return undefined
    const ho = h as Record<string, unknown>
    return {
      cta: parseLink(ho.cta),
      bullets: Array.isArray(ho.bullets) ? ho.bullets.filter(isNonEmptyString) : undefined,
    } satisfies LandingHero
  })()

  const sections = Array.isArray(obj.sections)
    ? obj.sections.filter(
        (sec): sec is LandingSection =>
          !!sec &&
          typeof sec === 'object' &&
          SECTION_TYPES.includes((sec as { type?: string }).type as (typeof SECTION_TYPES)[number])
      )
    : undefined

  return { hero, sections }
}

/** faq 列的形状是 [{ q, a }]，同样做防御性过滤 */
export function parseLandingFaq(raw: unknown): LandingFaq[] {
  if (!Array.isArray(raw)) return []
  return raw
    .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
    .map((item) => ({ q: String(item.q ?? ''), a: String(item.a ?? '') }))
    .filter((item) => item.q && item.a)
}

function parseLink(raw: unknown): LandingLink | undefined {
  if (!raw || typeof raw !== 'object') return undefined
  const o = raw as Record<string, unknown>
  if (!isNonEmptyString(o.label) || !isNonEmptyString(o.href)) return undefined
  return { label: o.label, href: o.href }
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.length > 0
}
