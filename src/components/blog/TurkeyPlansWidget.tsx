import Image from 'next/image'
import Link from 'next/link'
import type { LocalizedProduct } from '@/types/supabase'
import { formatPrice, getImageUrl } from '@/lib/mock-data'

type TurkeyPlansWidgetProps = {
  products: LocalizedProduct[]
  lng: string
}

export function TurkeyPlansWidget({ products, lng }: TurkeyPlansWidgetProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
        {lng === 'de' ? 'Keine Tarife verfugbar' : lng === 'zh' ? '暂无套餐' : 'No plans available'}
      </div>
    )
  }

  return (
    <section className="rounded-2xl border border-blue-100 bg-blue-50/40 p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-blue-700">Turkey Plans</p>
          <h3 className="text-lg font-semibold text-gray-900">
            {lng === 'de' ? 'Passende eSIM-Tarife' : lng === 'zh' ? '土耳其 eSIM 套餐' : 'Pick a Turkey eSIM plan'}
          </h3>
        </div>
        <Link
          href={`/${lng}/products?country=Turkey`}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {lng === 'de' ? 'Alle Tarife' : lng === 'zh' ? '查看全部' : 'View all'}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
            <div className="relative w-full h-40">
              <Image
                src={getImageUrl(product.image_url || undefined)}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                className="transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}
              <div className="mt-auto flex items-center justify-between">
                <div className="text-lg font-semibold text-blue-600">
                  {formatPrice(product.price, 'USD')}
                </div>
                {product.validity_days ? (
                  <span className="text-xs text-gray-500">
                    {product.validity_days} {lng === 'de' ? 'Tage' : lng === 'zh' ? '天' : 'days'}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
