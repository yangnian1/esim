import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProductById, getProducts } from '@/lib/supabase-services'
import { ProductImage } from '@/components/ProductImage'
import { languages, fallbackLng } from '@/i18n/settings'

// 静态翻译映射（只覆盖 i18n/settings.ts 里真正启用的语种）
const translations: Record<string, Record<string, string>> = {
  en: {
    products: 'eSIM Products',
    home: 'Home',
    country: 'Country',
    validity: 'Validity',
    data: 'Data',
    days: 'days',
    from: 'from',
    get_deal: 'View deal',
    unavailable: 'Currently unavailable',
    back_to_products: 'Back to all products',
    disclosure:
      'Affiliate link: if you buy through this link we may earn a commission. It costs you nothing extra.',
    provided_by: 'Offered by',
  },
  de: {
    products: 'eSIM-Produkte',
    home: 'Startseite',
    country: 'Land',
    validity: 'Gültigkeit',
    data: 'Datenvolumen',
    days: 'Tage',
    from: 'ab',
    get_deal: 'Zum Angebot',
    unavailable: 'Derzeit nicht verfügbar',
    back_to_products: 'Zurück zu allen Produkten',
    disclosure:
      'Werbelink: Wenn du über diesen Link buchst, erhalten wir ggf. eine Provision. Für dich entstehen dadurch keine Mehrkosten.',
    provided_by: 'Angeboten von',
  },
  zh: {
    products: 'eSIM 产品',
    home: '首页',
    country: '国家/地区',
    validity: '有效期',
    data: '流量',
    days: '天',
    from: '低至',
    get_deal: '查看优惠',
    unavailable: '暂时不可用',
    back_to_products: '返回全部产品',
    disclosure: '推广链接：通过此链接购买，我们可能获得佣金，你的价格不会因此增加。',
    provided_by: '由以下平台提供',
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '')

function getT(lng: string) {
  return (key: string) => translations[lng]?.[key] || translations[fallbackLng]?.[key] || key
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string; id: string }>
}): Promise<Metadata> {
  const { lng, id } = await params
  const { data: product } = await getProductById(Number(id), lng)

  if (!product || product.availability_status !== 'active') {
    return { title: 'Product Not Found' }
  }

  // product_localizations 里有逐语种写好的 SEO 标题/描述就直接用 ——
  // 它是人工写的、带关键词的，比拼接出来的强。没有才回退到拼接。
  const title =
    product.seo_title ||
    (product.country ? `${product.name} — eSIM ${product.country}` : product.name)
  const description =
    product.seo_description || product.short_description || product.description.slice(0, 160)

  return {
    title,
    description,
    alternates: siteUrl
      ? {
          canonical: `${siteUrl}/${lng}/products/${id}`,
          languages: {
            ...Object.fromEntries(
              languages.map((l) => [l, `${siteUrl}/${l}/products/${id}`])
            ),
            'x-default': `${siteUrl}/${fallbackLng}/products/${id}`,
          },
        }
      : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      images: product.image_url ? [product.image_url] : undefined,
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ lng: string; id: string }>
}) {
  const { lng, id } = await params
  const t = getT(lng)

  const productId = Number(id)
  if (!Number.isInteger(productId) || productId <= 0) {
    notFound()
  }

  const { data: product } = await getProductById(productId, lng)

  // 下架的产品不再对外可见（数据库里保留行，避免已收录页面直接消失）
  if (!product || product.availability_status !== 'active') {
    notFound()
  }

  const canBuy = Boolean(product.affiliate_url)
  // 出站一律走 /api/go，换联盟商时不用改这个页面
  const goHref = `/api/go/${product.id}?lng=${lng}`

  // 货币取库里的 currency 列（默认 USD）。按语种做本地化格式，
  // 德语市场看到 "19,99 $" 比 "$19.99" 自然得多。
  // 注意这里只是格式化，没有汇率换算：库里存的是什么币种就展示什么币种。
  const priceLabel = new Intl.NumberFormat(lng, {
    style: 'currency',
    currency: product.currency || 'USD',
  }).format(product.price)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.image_url ? { image: product.image_url } : {}),
    ...(siteUrl
      ? {
          offers: {
            '@type': 'Offer',
            price: product.price.toFixed(2),
            priceCurrency: product.currency || 'USD',
            availability: 'https://schema.org/InStock',
            url: `${siteUrl}/${lng}/products/${product.id}`,
          },
        }
      : {}),
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="container mx-auto px-4 py-12">
        {/* 面包屑：给爬虫的内链路径，也方便用户回到列表 */}
        <nav className="mb-8 text-sm text-gray-600" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={`/${lng}`} className="hover:text-blue-600 transition-colors">
                {t('home')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/${lng}/products`} className="hover:text-blue-600 transition-colors">
                {t('products')}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <ProductImage
              imageUrl={product.image_url}
              alt={product.name}
              country={product.country}
            />

            <div className="p-8 flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              <div className="space-y-3 mb-6">
                {product.country && (
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">{t('country')}</span>
                    <span className="font-medium text-gray-900">{product.country}</span>
                  </div>
                )}
                {product.data_label && (
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">{t('data')}</span>
                    <span className="font-medium text-gray-900">{product.data_label}</span>
                  </div>
                )}
                {product.validity_days && (
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">{t('validity')}</span>
                    <span className="font-medium text-gray-900">
                      {product.validity_days} {t('days')}
                    </span>
                  </div>
                )}
                {product.provider_name && (
                  <div className="flex items-center justify-between text-sm border-b pb-2">
                    <span className="text-gray-600">{t('provided_by')}</span>
                    <span className="font-medium text-gray-900 capitalize">
                      {product.provider_name}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <span className="text-sm text-gray-500">{t('from')}</span>
                <div className="text-3xl font-bold text-blue-600">{priceLabel}</div>
              </div>

              {/* 出站 CTA：rel 里的 sponsored 是给爬虫的付费链接声明，必须保留 */}
              {canBuy ? (
                <a
                  href={goHref}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                  className="block w-full text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {t('get_deal')}
                </a>
              ) : (
                <span className="block w-full text-center bg-gray-200 text-gray-500 py-3 px-6 rounded-lg font-semibold cursor-not-allowed">
                  {t('unavailable')}
                </span>
              )}

              {/* 联盟披露：欧盟/德国要求广告标识显著，必须紧邻 CTA，不能藏在页脚 */}
              {canBuy && (
                <p className="mt-3 text-xs text-gray-500 leading-relaxed">
                  {t('disclosure')}
                </p>
              )}
            </div>
          </div>

          {product.usp_bullets.length > 0 && (
            <ul className="mb-6 space-y-2">
              {product.usp_bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2 text-gray-700">
                  <span aria-hidden="true" className="mt-1 text-blue-600">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {product.description && (
            <div className="px-8 pb-8">
              <div className="prose prose-sm max-w-none text-gray-700 border-t pt-6">
                {product.description}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto mt-8">
          <Link
            href={`/${lng}/products`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← {t('back_to_products')}
          </Link>
        </div>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const { data } = await getProducts({ locale: fallbackLng, pageSize: 200 })
  const products = data ?? []

  return languages.flatMap((lng) =>
    products.map((product) => ({ lng, id: String(product.id) }))
  )
}

export const revalidate = 3600
