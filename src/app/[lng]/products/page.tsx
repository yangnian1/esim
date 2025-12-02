import Link from 'next/link'
import { getProducts } from '@/lib/supabase-services'
import { Suspense } from 'react'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    products: 'eSIM Products',
    back_to_home: 'Back to Home',
    no_products: 'No products available',
    loading: 'Loading products...',
    error: 'Failed to load products',
    validity: 'Validity',
    days: 'days',
    stock: 'Stock',
    country: 'Country',
    buy_now: 'Buy Now',
    view_details: 'View Details',
  },
  vi: {
    products: 'Sản phẩm eSIM',
    back_to_home: 'Về Trang chủ',
    no_products: 'Không có sản phẩm',
    loading: 'Đang tải sản phẩm...',
    error: 'Không thể tải sản phẩm',
    validity: 'Hiệu lực',
    days: 'ngày',
    stock: 'Kho',
    country: 'Quốc gia',
    buy_now: 'Mua Ngay',
    view_details: 'Xem Chi tiết',
  },
  de: {
    products: 'eSIM-Produkte',
    back_to_home: 'Zurück zur Startseite',
    no_products: 'Keine Produkte verfügbar',
    loading: 'Produkte laden...',
    error: 'Produkte konnten nicht geladen werden',
    validity: 'Gültigkeit',
    days: 'Tage',
    stock: 'Lager',
    country: 'Land',
    buy_now: 'Jetzt kaufen',
    view_details: 'Details anzeigen',
  },
  zh: {
    products: 'eSIM 产品',
    back_to_home: '返回首页',
    no_products: '暂无产品',
    loading: '加载中...',
    error: '加载失败',
    validity: '有效期',
    days: '天',
    stock: '库存',
    country: '国家',
    buy_now: '立即购买',
    view_details: '查看详情',
  },
}

// 产品列表组件
async function ProductsList({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  // 从 Supabase 获取产品数据
  const { data: products, error } = await getProducts({
    locale: lng,
    pageSize: 50,
  })

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">{t('error')}</p>
        <p className="text-gray-600 mt-2">{error}</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">{t('no_products')}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
        >
          {/* 产品图片占位符 */}
          <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
              {product.country || 'eSIM'}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {product.name}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>

            {/* 产品信息 */}
            <div className="space-y-2 mb-4">
              {product.country && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('country')}:</span>
                  <span className="font-medium">{product.country}</span>
                </div>
              )}
              {product.validity_days && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{t('validity')}:</span>
                  <span className="font-medium">
                    {product.validity_days} {t('days')}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('stock')}:</span>
                <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock}
                </span>
              </div>
            </div>

            {/* 价格和按钮 */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <span className="text-2xl font-bold text-blue-600">
                  ${product.price.toFixed(2)}
                </span>
              </div>
              <Link
                href={`/${lng}/products/${product.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t('view_details')}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 加载状态组件
function ProductsLoading({ lng }: { lng: string }) {
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <div className="text-center py-12">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p className="mt-4 text-gray-600">{t('loading')}</p>
    </div>
  )
}

// 主页面组件
export default async function ProductsPage({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('products')}</h1>
          <Link
            href={`/${lng}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            ← {t('back_to_home')}
          </Link>
        </div>

        {/* 产品列表 */}
        <Suspense fallback={<ProductsLoading lng={lng} />}>
          <ProductsList lng={lng} />
        </Suspense>
      </div>
    </main>
  )
}

// 生成静态参数（用于静态生成）
export async function generateStaticParams() {
  return [
    { lng: 'en' },
    { lng: 'vi' },
    { lng: 'de' },
    { lng: 'zh' },
  ]
}
