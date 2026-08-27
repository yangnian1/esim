import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/seo'
import { IMPRESSUM, isImpressumConfigured } from '@/lib/legal'
import { languages } from '@/i18n/settings'

/**
 * Impressum（DDG §5 / MStV §18）。
 *
 * ⚠️ 数据没填齐时整页 notFound() —— 见 lib/legal.ts 里的说明：
 * 发布一份编造的 Impressum 比没有 Impressum 更糟。
 *
 * 不进 sitemap：页脚每一页都有入口，DDG 要求的「两次点击内可达」已经满足，
 * 而这类页面本来也不需要争排名。
 */
export const revalidate = 3600

export function generateStaticParams() {
  if (!isImpressumConfigured()) return []
  return languages.map((lng) => ({ lng }))
}

const SEO_COPY = {
  de: {
    title: 'Impressum',
    description: 'Anbieterkennzeichnung nach § 5 DDG und § 18 MStV.',
  },
  en: {
    title: 'Legal notice',
    description: 'Provider identification pursuant to § 5 DDG and § 18 MStV.',
  },
  zh: {
    title: '法律声明',
    description: '依据德国 DDG §5 与 MStV §18 的运营者信息公示。',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  const { lng } = await params
  const base = buildPageMetadata({ lng, path: (l) => `/${l}/impressum`, copy: SEO_COPY })
  return base
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-3 border-b border-gray-100 last:border-0 sm:flex sm:gap-6">
      <dt className="text-sm font-medium text-gray-500 sm:w-56 sm:flex-shrink-0">{label}</dt>
      <dd className="text-gray-900 mt-1 sm:mt-0">{children}</dd>
    </div>
  )
}

export default async function ImpressumPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params

  if (!isImpressumConfigured()) notFound()

  const d = IMPRESSUM
  const responsible = d.contentResponsible?.trim() || d.name

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href={`/${lng}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            ← Zurück zur Startseite
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Impressum</h1>
            <p className="text-gray-500 mb-8">Angaben gemäß § 5 DDG</p>

            <dl>
              <Row label="Anbieter">
                {d.name}
                {d.representative?.trim() && (
                  <>
                    <br />
                    <span className="text-gray-600">
                      Vertreten durch: {d.representative}
                    </span>
                  </>
                )}
              </Row>
              <Row label="Anschrift">
                {d.street}
                <br />
                {d.city}
                <br />
                {d.country}
              </Row>
              <Row label="E-Mail">
                <a href={`mailto:${d.email}`} className="text-blue-600 hover:text-blue-800">
                  {d.email}
                </a>
              </Row>
              {d.phone?.trim() && <Row label="Telefon">{d.phone}</Row>}
              {d.registration?.trim() && <Row label="Registereintrag">{d.registration}</Row>}
              {d.vatId?.trim() && (
                <Row label="USt-IdNr.">
                  {d.vatId}
                  <br />
                  <span className="text-sm text-gray-500">
                    Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG
                  </span>
                </Row>
              )}
              <Row label="Inhaltlich verantwortlich">
                {responsible}
                <br />
                <span className="text-gray-600">
                  {d.street}, {d.city}
                </span>
                <br />
                <span className="text-sm text-gray-500">gemäß § 18 Abs. 2 MStV</span>
              </Row>
            </dl>
          </div>

          {/* 联盟披露 —— Impressum 页也说一遍，广告标识要显著 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Hinweis zu Werbelinks</h2>
            <p className="text-gray-700 leading-relaxed">
              hello esims ist eine Vergleichs- und Ratgeberseite und verkauft selbst keine eSIMs.
              Links zu Anbietern sind Werbelinks: Wenn du darüber buchst, erhalten wir unter
              Umständen eine Provision. Für dich ändert sich der Preis dadurch nicht. Diese Links
              sind dort gekennzeichnet, wo sie stehen.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Streitbeilegung</h2>
            <p className="text-gray-700 leading-relaxed">
              Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
