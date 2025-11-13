'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { getImageUrl, formatPrice } from '@/lib/mock-data'

interface ProductCardProps {
  product: Product
  lng: string
}

export const ProductCard = ({ product, lng }: ProductCardProps) => {
  // 处理图片：使用image字段
  const getProductImageUrl = () => {
    if (product.image?.url) {
      return getImageUrl(product.image.url)
    }
    return '/placeholder.png'
  }

  // 获取价格：优先使用price字段，然后是original_price
  const getPrice = () => {
    if (product.price !== null && product.price !== undefined) {
      return product.price
    }
    if (product.original_price !== null && product.original_price !== undefined) {
      return product.original_price
    }
    return null
  }

  // 获取显示名称：优先使用name字段，然后是title
  const getDisplayName = () => {
    return product.name || product.title || '未命名产品'
  }

  // 判断产品状态
  const isAvailable = product.product_status === 'active' && (product.stock ?? 0) >= 0
  const isOutOfStock = (product.stock ?? 0) === 0

  const imageUrl = getProductImageUrl()
  const price = getPrice()
  const displayName = getDisplayName()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-48 xl:h-56">
        <Image
          src={imageUrl}
          alt={displayName}
          fill
          style={{ objectFit: 'cover' }}
          className="transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* 产品状态标签 */}
        {!isAvailable && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            {lng === 'zh' ? '不可用' : 'Unavailable'}
          </div>
        )}
        {isAvailable && isOutOfStock && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
            {lng === 'zh' ? '缺货' : 'Out of Stock'}
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
            {lng === 'zh' ? '推荐' : 'Featured'}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate leading-tight">
          {displayName}
        </h3>
        
        {/* 短描述或描述 */}
        {(product.short_description || product.description) && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-snug">
            {product.short_description || product.description}
          </p>
        )}

        {/* 分类信息 */}
        {product.category && (
          <p className="text-xs text-gray-500 mb-2">
            {lng === 'zh' ? '分类' : 'Category'}: {product.category.name}
          </p>
        )}

        {/* 有效期 */}
        {product.validity_days && (
          <p className="text-xs text-gray-500 mb-2">
            {lng === 'zh' ? '有效期' : 'Validity'}: {product.validity_days} {lng === 'zh' ? '天' : 'days'}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex flex-col">
            {price !== null && (
              <div className="flex items-center">
                <p className="text-xl font-bold text-blue-600">
                  {formatPrice(price, product.currency || (lng === 'zh' ? 'CNY' : 'USD'))}
                </p>
                {/* 显示货币 */}
                {product.currency && (
                  <span className="text-xs text-gray-500 ml-1">{product.currency}</span>
                )}
              </div>
            )}
            {price === null && (
              <p className="text-lg text-gray-500">
                {lng === 'zh' ? '价格待定' : 'Price TBD'}
              </p>
            )}
            {/* 库存信息 */}
            {product.stock !== null && product.stock !== undefined && (
              <p className="text-xs text-gray-500 mt-1">
                {lng === 'zh' ? '库存' : 'Stock'}: {product.stock}
              </p>
            )}
          </div>
          
          <Link
            href={`/${lng}/products/${product.id}`}
            className={`ml-4 px-3 py-1 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isAvailable 
                ? 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            {...(!isAvailable && { 'aria-disabled': true })}
          >
            {lng === 'zh' ? '查看详情' : 'View Details'}
          </Link>
        </div>
      </div>
    </div>
  )
} 