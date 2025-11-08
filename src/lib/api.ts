// Strapi API 配置和封装
import { API_CONFIG, apiLogger } from './config'
import { Product, Article, StrapiResponse } from '@/types'

// 基础接口类型定义
export interface StrapiItem {
  id: number
  attributes: Record<string, unknown>
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 排序参数
export interface SortParams {
  field: string
  order: 'asc' | 'desc'
}

// 筛选参数
export interface FilterParams {
  [key: string]: unknown
}

// 基础 API 请求函数
async function apiRequest<T>(endpoint: string): Promise<T> {
  const fullUrl = `${API_CONFIG.BASE_URL}${endpoint}`
  
  try {
    // 记录请求日志
    apiLogger.logRequest('GET', fullUrl)
    
    const response = await fetch(fullUrl)
    
    if (!response.ok) {
      apiLogger.logError(fullUrl, new Error(`API请求失败: ${response.status} ${response.statusText}`))
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // 记录响应日志
    apiLogger.logResponse(fullUrl, response, data)
    
    return data
  } catch (error) {
    apiLogger.logError(fullUrl, error as Error)
    throw error
  }
}

// 简化的文章查询参数构建
function buildArticleQueryParams(options: {
  page?: number
  limit?: number
}): string {
  const searchParams = new URLSearchParams()
  
  // 只添加 page 和 limit 参数
  if (options.page) {
    searchParams.append('page', options.page.toString())
  }
  
  if (options.limit) {
    searchParams.append('limit', options.limit.toString())
  }
  
  return searchParams.toString()
}

// 构建查询参数
function buildQueryParams(params: {
  populate?: boolean
  pagination?: PaginationParams
  sort?: SortParams
  filters?: FilterParams
  locale?: string
}): string {
  const searchParams = new URLSearchParams()
  
  // 添加 populate 参数
  if (params.populate) {
    searchParams.append('populate', '*')
  }
  
  // 添加分页参数
  if (params.pagination) {
    if (params.pagination.page) {
      searchParams.append('pagination[page]', params.pagination.page.toString())
    }
    if (params.pagination.pageSize) {
      searchParams.append('pagination[pageSize]', params.pagination.pageSize.toString())
    }
  }
  
  // 添加排序参数
  if (params.sort) {
    searchParams.append('sort', `${params.sort.field}:${params.sort.order}`)
  }
  
  // 添加筛选参数
  if (params.filters) {
    Object.entries(params.filters).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value as Record<string, unknown>).forEach(([subKey, subValue]) => {
          searchParams.append(`filters[${key}][${subKey}]`, String(subValue))
        })
      } else {
        searchParams.append(`filters[${key}]`, String(value))
      }
    })
  }
  
  // 添加语言参数
  if (params.locale) {
    searchParams.append('locale', params.locale)
  }
  
  return searchParams.toString()
}

// 商品 API
export const productsApi = {
  // 获取商品列表
  async getList(options: {
    pagination?: PaginationParams
    sort?: SortParams
    filters?: FilterParams
  } = {}): Promise<StrapiResponse<Product[]>> {
    const queryParams = buildQueryParams({
      populate: true,
      ...options
    })
    
    return apiRequest<StrapiResponse<Product[]>>(`/api/products?${queryParams}`)
  },

  // 获取特色商品
  async getFeatured(options: {
    pagination?: PaginationParams
  } = {}): Promise<StrapiResponse<Product[]>> {
    const queryParams = buildQueryParams({
      populate: true,
      filters: { featured: { $eq: true } },
      ...options
    })
    
    return apiRequest<StrapiResponse<Product[]>>(`/api/products?${queryParams}`)
  },

  // 按分类获取商品
  async getByCategory(categoryId: number, options: {
    pagination?: PaginationParams
    sort?: SortParams
  } = {}): Promise<StrapiResponse<Product[]>> {
    const queryParams = buildQueryParams({
      populate: true,
      filters: { category: { id: { $eq: categoryId } } },
      ...options
    })
    
    return apiRequest<StrapiResponse<Product[]>>(`/api/products?${queryParams}`)
  },

  // 获取商品详情
  async getById(id: number): Promise<StrapiResponse<Product>> {
    const queryParams = buildQueryParams({ populate: true })
    return apiRequest<StrapiResponse<Product>>(`/api/products/${id}?${queryParams}`)
  }
}

// 文章 API
export const articlesApi = {
  // 获取文章列表 - 修复API路径格式
  async getList(locale: string, options: {
    page?: number
    limit?: number
  } = {}): Promise<StrapiResponse<Article[]>> {
    const queryParams = buildArticleQueryParams(options)
    // 修复：使用正确的API路径格式 /api/articles/language/{language}
    const endpoint = `/api/articles/language/${locale}?${queryParams}`
    
    return apiRequest<StrapiResponse<Article[]>>(endpoint)
  },

  // 按分类获取文章 - 修复API路径格式
  async getByCategory(locale: string, category: string, options: {
    page?: number
    limit?: number
  } = {}): Promise<StrapiResponse<Article[]>> {
    const queryParams = buildArticleQueryParams(options)
    // 修复：使用正确的API路径格式，先按语言获取，然后前端过滤分类
    const endpoint = `/api/articles/language/${locale}?${queryParams}`
    
    return apiRequest<StrapiResponse<Article[]>>(endpoint)
  },

  // 获取最新文章
  async getLatest(locale: string, limit: number = 3): Promise<StrapiResponse<Article[]>> {
    // 修复：使用正确的API路径格式
    const endpoint = `/api/articles/language/${locale}?page=1&limit=${limit}`
    
    return apiRequest<StrapiResponse<Article[]>>(endpoint)
  },

  // 获取文章详情 - 使用新的组ID和语言端点
  async getByGroupId(groupId: string, locale: string): Promise<StrapiResponse<Article>> {
    const queryParams = buildQueryParams({ populate: true })
    return apiRequest<StrapiResponse<Article>>(`/api/articles/group/${groupId}/language/${locale}?${queryParams}`)
  },

  // 保留旧的getById方法以兼容性（可选）
  async getById(id: number, locale: string): Promise<StrapiResponse<Article>> {
    const queryParams = buildQueryParams({ populate: true, locale })
    return apiRequest<StrapiResponse<Article>>(`/api/articles/${id}?${queryParams}`)
  }
}

// API 工具函数
export const apiUtils = {
  // 格式化价格
  formatPrice(price: number | null | undefined, currency: string = '¥'): string {
    if (!price) return '价格待定'
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency === '$' ? 'USD' : 'CNY',
    }).format(price)
  },

  // 格式化日期
  formatDate(dateString: string, locale: string = 'zh-CN'): string {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  },

  // 获取图片完整URL
  getImageUrl(imageUrl?: string): string {
    if (!imageUrl) return '/placeholder.png'
    if (imageUrl.startsWith('http')) return imageUrl
    return `${API_CONFIG.BASE_URL}${imageUrl}`
  }
} 