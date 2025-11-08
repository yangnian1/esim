// 服务端渲染版本 - 移除所有客户端状态
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types'
import { ChevronLeft, Zap, Shield, Globe, Star } from 'lucide-react'

interface ProductModalProps {
  product: Product
  lng: string
  isOpen?: boolean
  onClose?: () => void
}

// 获取产品图片URL
const getProductImageUrl = (product: Product): string => {
  if (product.image?.url) {
    return product.image.url.startsWith('http') 
      ? product.image.url 
      : `${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`
  }
  return 'https://via.placeholder.com/300x200?text=eSIM'
}

// 获取产品显示名称
const getProductDisplayName = (product: Product, lng: string): string => {
  if (lng === 'zh' && product.display_name_zh) {
    return product.display_name_zh
  }
  return product.display_name || product.title || 'eSIM'
}

// 获取产品描述
const getProductDescription = (product: Product, lng: string): string => {
  if (lng === 'zh' && product.description_zh) {
    return product.description_zh
  }
  return product.description || '高质量的eSIM服务'
}

// 格式化价格
const formatPrice = (price: number | undefined, currency: string = 'USD'): string => {
  if (!price) return '价格待定'
  return `${currency === 'USD' ? '$' : '¥'}${price}`
}

// 服务端渲染的产品模态框组件 - 作为页面显示
export function ProductModal({ product, lng }: ProductModalProps) {
  const displayName = getProductDisplayName(product, lng)
  const description = getProductDescription(product, lng)
  const imageUrl = getProductImageUrl(product)
  const price = formatPrice(product.price, product.currency)
  
  // 模拟的附加信息
  const features = [
    { icon: <Zap className="h-5 w-5" />, text: lng === 'zh' ? '即时激活' : 'Instant Activation' },
    { icon: <Shield className="h-5 w-5" />, text: lng === 'zh' ? '安全连接' : 'Secure Connection' },
    { icon: <Globe className="h-5 w-5" />, text: lng === 'zh' ? '全球覆盖' : 'Global Coverage' }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* 返回链接 */}
      <div className="mb-6">
        <Link 
          href={`/${lng}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          {lng === 'zh' ? '返回产品列表' : 'Back to Products'}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 产品图片 */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          
          {/* 产品特性 */}
          <div className="grid grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-blue-600 mb-2">
                  {feature.icon}
                </div>
                <span className="text-xs text-gray-600">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 产品信息 */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h1>
            
            {/* 评分 */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">4.0 (128 {lng === 'zh' ? '评价' : 'reviews'})</span>
            </div>
            
            {/* 价格 */}
            <div className="text-3xl font-bold text-blue-600 mb-4">{price}</div>
          </div>

          {/* 产品描述 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {lng === 'zh' ? '产品描述' : 'Description'}
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          {/* 产品规格 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {lng === 'zh' ? '产品规格' : 'Specifications'}
            </h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-600">{lng === 'zh' ? '有效期' : 'Validity'}:</dt>
                <dd className="font-medium">{lng === 'zh' ? '30天' : '30 days'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{lng === 'zh' ? '数据量' : 'Data'}:</dt>
                <dd className="font-medium">{lng === 'zh' ? '不限量' : 'Unlimited'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{lng === 'zh' ? '网络' : 'Network'}:</dt>
                <dd className="font-medium">4G/5G</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-600">{lng === 'zh' ? '激活方式' : 'Activation'}:</dt>
                <dd className="font-medium">{lng === 'zh' ? '扫码激活' : 'QR Code'}</dd>
              </div>
            </dl>
          </div>

          {/* 购买按钮 */}
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {lng === 'zh' ? '立即购买' : 'Buy Now'}
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {lng === 'zh' ? '加入购物车' : 'Add to Cart'}
            </button>
          </div>

          {/* 购买保障 */}
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">
              {lng === 'zh' ? '购买保障' : 'Purchase Protection'}
            </h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✓ {lng === 'zh' ? '7天无理由退换' : '7-day return policy'}</li>
              <li>✓ {lng === 'zh' ? '24小时客服支持' : '24/7 customer support'}</li>
              <li>✓ {lng === 'zh' ? '正品保证' : 'Authentic products'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 