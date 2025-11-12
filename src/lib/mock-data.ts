// 模拟数据文件 - 替代 Strapi API
import { Product, Article } from '@/types'

// 模拟产品数据
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Japan eSIM 5GB',
    title: 'Japan eSIM 5GB',
    description: 'Japan high-speed network, 5GB data, valid for 7 days',
    short_description: 'Japan 7-day high-speed',
    price: 19.99,
    original_price: 24.99,
    sale_price: 19.99,
    sku: 'JP-5GB-7D',
    stock: 100,
    brand: 'eSIM Global',
    currency: '$',
    product_status: 'active',
    countries: ['Japan'],
    regions: ['Asia'],
    validity_days: 7,
    featured: true,
    image: {
      url: '/placeholder.png',
      alt: 'Japan eSIM'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  },
  {
    id: 2,
    name: 'Korea eSIM 8GB',
    title: 'Korea eSIM 8GB',
    description: 'Korea high-speed network, 8GB data, valid for 10 days',
    short_description: 'Korea 10-day high-speed',
    price: 25.99,
    original_price: 29.99,
    sale_price: 25.99,
    sku: 'KR-8GB-10D',
    stock: 120,
    brand: 'eSIM Global',
    currency: '$',
    product_status: 'active',
    countries: ['South Korea'],
    regions: ['Asia'],
    validity_days: 10,
    featured: true,
    image: {
      url: '/placeholder.png',
      alt: 'Korea eSIM'
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  }
]

// 模拟文章数据
export const mockArticles: Article[] = [
  {
    id: 1,
    title: 'eSIM Technology Guide',
    content: 'Detailed introduction to eSIM technology...',
    excerpt: 'Complete guide to eSIM technology',
    slug: 'esim-technology-guide',
    author: 'eSIM Team',
    featured_image: {
      url: '/placeholder.png',
      alt: 'eSIM Guide'
    },
    category: 'Technology',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    locale: 'en'
  }
]

// 工具函数
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
  return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '/placeholder.png'
  if (imageUrl.startsWith('http')) return imageUrl
  return imageUrl
}
