// 产品相关类型
export interface Product {
  id: number
  name: string
  title: string
  description?: string
  description_zh?: string
  display_name?: string
  display_name_zh?: string
  short_description: string
  price?: number
  original_price: number
  sale_price?: number
  sku: string
  stock: number
  brand: string
  currency?: string
  product_status: string
  countries: string[]
  regions: string[]
  validity_days: number
  featured: boolean
  category_id?: number
  category?: {
    id: number
    name: string
    slug?: string
  }
  image?: {
    url: string
    alt?: string
    alternativeText: string
  }
  availability?: boolean
  rating?: number
  reviews_count?: number
  created_at?: string
  updated_at?: string
  publishedAt: string
  locale: string
}

// 文章相关类型
export interface Article {
  id: number
  title: string
  title_zh?: string
  content: string
  excerpt?: string
  excerpt_zh?: string
  slug: string
  article_group_id: string  // 新增：文章组ID
  author?: string
  category?: string
  category_id?: number
  tags?: string[]
  featured_image?: {
    url: string
    alternativeText: string
  }
  createdAt: string
  created_at?: string
  updatedAt: string
  publishedAt: string
  published_at?: string
  locale: string
}

// 分类相关类型
export interface Category {
  id: number
  name: string
  slug: string
  level: number
  parent?: {
    id: number
    name: string
    slug: string
  }
  children?: Category[]
  products?: Product[]
  attributes?: {
    product_count: number
  }
}

// API响应类型
export interface StrapiResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// 通用响应类型
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  error?: string
} 