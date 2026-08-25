import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getLandingPage, getPublishedLandingPages } from '@/lib/supabase-services'
import { parseLandingContent, parseLandingFaq } from '@/types/landing'
import { LandingSectionRenderer } from '@/components/landing/LandingSections'
import { languages } from '@/i18n/settings'

/**
 * 程序化落地页：/{lng}/{slug}，内容全部来自 landing_pages 表。
 *
 * 这是个「兜底」动态段，只会在所有静态段（/products、/blog、/auth …）
 * 都没匹配上时才命中 —— Next 的路由优先级里静态段永远赢过动态段。
 * 所以新增静态路由不会被它抢走，但反过来：**新增静态路由要确认没有
 * 同名的 landing_pages.slug**，否则那条数据会永远访问不到。
 *
 * 加一个国家的落地页 = 往 landing_pages 插一行，不需要动代码。
 */
export const revalidate = 3600

interface LandingProps {
  params: Promise<{ lng: string; slug: string }>
}

export async function generateStaticParams() {
  const { data } = await getPublishedLandingPages()
  // 只生成库里真实存在的 (locale, slug) 组合。
  // 不做 languages × slugs 的笛卡尔积 —— 那正是原来硬编码页面的毛病：
  // 德语内容被同时挂到 /en 和 /zh 上，变成两份重复内容。
  return (data ?? [])
    .filter((row) => languages.includes(row.locale))
    .map((row) => ({ lng: row.locale, slug: row.slug.replace(/^\/+/, '') }))
}

export async function generateMetadata({ params }: LandingProps): Promise<Metadata> {
  const { lng, slug } = await params
  const { data: page } = await getLandingPage(lng, slug)

  if (!page) {
    return { title: 'Not found', robots: { index: false, follow: false } }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')
  const canonical =
    page.canonical_url ||
    (siteUrl ? `${siteUrl}/${lng}/${page.slug.replace(/^\/+/, '')}` : undefined)

  // hreflang 只列出**这个 slug 真正存在的语种**。
  // 把不存在的语种也写进去会让 Google 抓到 404，反过来伤害整组页面。
  const { data: siblings } = await getPublishedLandingPages()
  const sameSlug = (siblings ?? []).filter(
    (row) => row.slug.replace(/^\/+/, '') === page.slug.replace(/^\/+/, '')
  )

  const languagesMap =
    siteUrl && sameSlug.length > 1
      ? Object.fromEntries(
          sameSlug
            .filter((row) => languages.includes(row.locale))
            .map((row) => [row.locale, `${siteUrl}/${row.locale}/${row.slug.replace(/^\/+/, '')}`])
        )
      : undefined

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.intro || undefined,
    alternates: {
      ...(canonical ? { canonical } : {}),
      ...(languagesMap ? { languages: languagesMap } : {}),
    },
    openGraph: {
      type: 'website',
      title: page.seo_title || page.title,
      description: page.seo_description || page.intro || undefined,
      url: canonical,
    },
  }
}

export default async function LandingPage({ params }: LandingProps) {
  const { lng, slug } = await params
  const { data: page } = await getLandingPage(lng, slug)

  if (!page) {
    notFound()
  }

  const content = parseLandingContent(page.content)
  const faqs = parseLandingFaq(page.faq)

  const faqJsonLd =
    faqs.length > 0
      ? JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })
      : null

  return (
    <>
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />
      )}

      <main className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-b from-purple-50 to-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href={`/${lng}`} className="hover:text-purple-600 transition-colors">
                {lng === 'de' ? 'Startseite' : lng === 'zh' ? '首页' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">{page.h1}</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {page.h1}
            </h1>

            {page.intro && (
              <p className="text-lg text-gray-600 mb-6 max-w-2xl">{page.intro}</p>
            )}

            {content.hero?.cta && (
              <Link
                href={content.hero.cta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-medium shadow hover:bg-purple-700 transition-colors"
              >
                {content.hero.cta.label}
              </Link>
            )}

            {content.hero?.bullets && content.hero.bullets.length > 0 && (
              <ul className="mt-8 space-y-2 text-gray-700">
                {content.hero.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span aria-hidden="true" className="mt-1 text-purple-500">
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {content.sections?.map((section, i) => (
          <LandingSectionRenderer key={`${section.type}-${i}`} section={section} lng={lng} />
        ))}

        {faqs.length > 0 && (
          <section className="py-12 md:py-16 bg-white">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                {lng === 'de' ? 'Häufige Fragen' : lng === 'zh' ? '常见问题' : 'FAQ'}
              </h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4"
                  >
                    <summary className="cursor-pointer text-base font-semibold text-gray-900 marker:text-purple-500 group-open:mb-3">
                      {faq.q}
                    </summary>
                    <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  )
}

