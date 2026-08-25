import Link from 'next/link'
import { getProducts } from '@/lib/supabase-services'
import type {
  CalloutSection,
  CardsSection,
  CtaSection,
  LandingSection,
  ProductsSection,
  RichTextSection,
  StepsSection,
} from '@/types/landing'

// 产品表的表头和「天」的单位要跟着落地页的语种走。
// 之前这里写死了德语，英文落地页上会出现 "Tarif / Gültigkeit / 7 Tage"。
const TABLE_I18N: Record<
  string,
  { plan: string; data: string; validity: string; price: string; days: (n: number) => string }
> = {
  de: { plan: 'Tarif', data: 'Daten', validity: 'Gültigkeit', price: 'Preis', days: (n) => `${n} Tage` },
  en: { plan: 'Plan', data: 'Data', validity: 'Validity', price: 'Price', days: (n) => `${n} days` },
  zh: { plan: '套餐', data: '流量', validity: '有效期', price: '价格', days: (n) => `${n} 天` },
}
const tableI18n = (lng: string) => TABLE_I18N[lng] ?? TABLE_I18N.en

const H2_BASE = 'text-2xl md:text-3xl font-bold text-gray-900'
const H2 = `${H2_BASE} mb-8`
const H2_TIGHT = `${H2_BASE} mb-6`
const WRAP = 'container mx-auto px-4 max-w-4xl'

function Cards({ section }: { section: CardsSection }) {
  return (
    <section className="py-12 md:py-16">
      <div className={WRAP}>
        {section.heading && <h2 className={H2}>{section.heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {section.items.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              {item.desc && <p className="text-sm text-gray-600 flex-grow">{item.desc}</p>}
              {item.note && <p className="mt-4 text-sm font-medium text-purple-700">{item.note}</p>}
              {item.cta && (
                <Link
                  href={item.cta.href}
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-purple-400 hover:text-purple-700 transition-colors"
                >
                  {item.cta.label}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/**
 * 产品对比表。数据实时从 esim_products 取，不写进内容里 ——
 * 换价格、上下架产品都不需要改落地页内容。
 */
async function Products({ section, lng }: { section: ProductsSection; lng: string }) {
  const { data: products } = await getProducts({
    locale: lng,
    pageSize: 24,
    country: section.country,
  })
  const t = tableI18n(lng)

  return (
    <section id={section.anchor ?? 'tarife'} className="py-12 md:py-16 bg-white scroll-mt-20">
      <div className={WRAP}>
        {section.heading && <h2 className={H2}>{section.heading}</h2>}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {products.length === 0 ? (
            <p className="text-center text-gray-500 py-6">—</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">{t.plan}</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">{t.data}</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">{t.validity}</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-700">{t.price}</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm">
                        {/* 指向产品详情页而不是列表页：那里有本地化文案、
                            联盟披露和出站按钮，是真正的转化落点 */}
                        <Link
                          href={`/${lng}/products/${p.id}`}
                          className="font-medium text-gray-900 hover:text-purple-700 transition-colors"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{p.data_label ?? '–'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {p.validity_days ? t.days(p.validity_days) : '–'}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                        {/* 用产品自己的币种，不再写死 USD */}
                        {new Intl.NumberFormat(lng, {
                          style: 'currency',
                          currency: p.currency || 'USD',
                        }).format(p.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function RichText({ section }: { section: RichTextSection }) {
  return (
    <section className="py-12 md:py-16">
      <div className={WRAP}>
        {section.heading && <h2 className={H2_TIGHT}>{section.heading}</h2>}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          {section.paragraphs.map((p, i) => (
            <p key={i} className="text-gray-700">
              {p.strong && <strong className="text-gray-900">{p.strong}</strong>}
              {p.strong ? ' ' : ''}
              {p.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}

function Steps({ section }: { section: StepsSection }) {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className={WRAP}>
        {section.heading && <h2 className={H2}>{section.heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.groups.map((group) => (
            <div key={group.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h3>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                    <span aria-hidden="true" className="mt-0.5 text-purple-500">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {section.footnote && <p className="mt-6 text-sm text-gray-600">{section.footnote}</p>}
      </div>
    </section>
  )
}

function Callout({ section }: { section: CalloutSection }) {
  return (
    <section className="py-12 md:py-16">
      <div className={WRAP}>
        {section.heading && <h2 className={H2_TIGHT}>{section.heading}</h2>}
        <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6">
          <p className="text-gray-800">{section.text}</p>
          {section.link && (
            <p className="mt-3">
              <Link
                href={section.link.href}
                className="text-amber-800 hover:text-amber-900 font-medium underline transition-colors"
              >
                {section.link.label} →
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function Cta({ section }: { section: CtaSection }) {
  return (
    <section className="py-12 md:py-16">
      <div className={`${WRAP} text-center`}>
        {section.heading && (
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{section.heading}</h2>
        )}
        {section.text && <p className="text-gray-600 mb-8 max-w-lg mx-auto">{section.text}</p>}
        {section.cta && (
          <Link
            href={section.cta.href}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 text-white font-medium shadow hover:bg-purple-700 transition-colors"
          >
            {section.cta.label} →
          </Link>
        )}
      </div>
    </section>
  )
}

export function LandingSectionRenderer({
  section,
  lng,
}: {
  section: LandingSection
  lng: string
}) {
  switch (section.type) {
    case 'cards':
      return <Cards section={section} />
    case 'products':
      return <Products section={section} lng={lng} />
    case 'richtext':
      return <RichText section={section} />
    case 'steps':
      return <Steps section={section} />
    case 'callout':
      return <Callout section={section} />
    case 'cta':
      return <Cta section={section} />
    default:
      // 内容里出现了渲染器不认识的 type：跳过而不是让整页 500
      return null
  }
}
