// API配置和环境管理
const getApiBaseUrl = (): string => {
  // 优先使用环境变量，否则根据NODE_ENV自动切换
  if (process.env.NEXT_PUBLIC_STRAPI_URL) {
    return process.env.NEXT_PUBLIC_STRAPI_URL
  }
  
  // 根据环境自动切换
  if (process.env.NODE_ENV === 'production') {
    return 'http://admin.esimconnects.com'
  }
  
  return 'http://localhost:1337'
}

// 导出API配置
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  ENDPOINTS: {
    CATEGORIES: '/api/categories',
    PRODUCTS: '/api/products',
    ARTICLES: '/api/articles',
  }
} as const

// 调试配置
export const DEBUG_CONFIG = {
  // 是否启用API调试日志
  enableApiLogs: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true',
  // 是否显示详细的请求信息
  enableVerboseLogs: process.env.NEXT_PUBLIC_VERBOSE_LOGS === 'true',
  // 是否模拟Network面板显示
  enableNetworkSimulation: process.env.NEXT_PUBLIC_NETWORK_LOGS === 'true'
}

// 获取完整的API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// 获取图片完整URL
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return ''
  
  // 如果已经是完整的HTTP/HTTPS URL，直接返回
  if (imageUrl.startsWith('http')) return imageUrl
  
  // 如果是placeholder或本地静态资源（以/开头），保持相对路径
  if (imageUrl.startsWith('/')) return imageUrl
  
  // 其他情况拼接API基础URL（如Strapi上传的文件）
  return `${API_CONFIG.BASE_URL}${imageUrl}`
}

// 环境信息
export const ENV_INFO = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  currentApiUrl: API_CONFIG.BASE_URL,
  environment: process.env.NODE_ENV || 'development'
}

// API日志工具
export const apiLogger = {
  // 模拟Network面板的请求日志
  logRequest: (method: string, url: string, options?: RequestInit) => {
    if (!DEBUG_CONFIG.enableApiLogs) return
    
    const timestamp = new Date().toLocaleTimeString()
    
    if (DEBUG_CONFIG.enableNetworkSimulation) {
      console.group(`🌐 [${timestamp}] ${method.toUpperCase()} ${url}`)
      
      if (options?.headers) {
        console.log('📤 Request Headers:', options.headers)
      }
      
      if (options?.body) {
        console.log('📤 Request Body:', options.body)
      }
      
      console.groupEnd()
    } else if (DEBUG_CONFIG.enableVerboseLogs) {
      console.log(`🔍 [${timestamp}] API请求: ${method.toUpperCase()} ${url}`)
    }
  },

  // 模拟Network面板的响应日志
  logResponse: (url: string, response: Response, data?: unknown) => {
    if (!DEBUG_CONFIG.enableApiLogs) return
    
    const timestamp = new Date().toLocaleTimeString()
    const statusColor = response.ok ? '✅' : '❌'
    
    if (DEBUG_CONFIG.enableNetworkSimulation) {
      console.group(`${statusColor} [${timestamp}] ${response.status} ${url}`)
      
      console.log('📥 Response Headers:', Object.fromEntries(response.headers.entries()))
      console.log('📥 Response Status:', response.status, response.statusText)
      
      if (data) {
        console.log('📥 Response Data:', data)
      }
      
      console.groupEnd()
    } else if (DEBUG_CONFIG.enableVerboseLogs) {
      console.log(`${statusColor} [${timestamp}] API响应: ${response.status} ${url}`)
      if (data) {
        console.log('返回数据:', data)
      }
    }
  },

  // 错误日志
  logError: (url: string, error: Error) => {
    if (!DEBUG_CONFIG.enableApiLogs) return
    
    const timestamp = new Date().toLocaleTimeString()
    console.group(`💥 [${timestamp}] API错误: ${url}`)
    console.error('错误信息:', error.message)
    console.error('错误堆栈:', error.stack)
    console.groupEnd()
  }
}

// 调试信息
if (typeof window !== 'undefined') {
  console.log('🔧 API配置信息:', {
    baseUrl: API_CONFIG.BASE_URL,
    environment: ENV_INFO.environment,
    envVariable: process.env.NEXT_PUBLIC_STRAPI_URL,
    debugConfig: DEBUG_CONFIG
  })
}

export function formatPrice(
  price: number, 
  currency: string = 'USD', 
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(price)
}

export function formatDate(
  dateString: string, 
  locale: string = 'en-US', 
  options: Intl.DateTimeFormatOptions = {}
): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale, options).format(date)
} 