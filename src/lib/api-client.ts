// 增强的API客户端，支持调试和监控
import { API_CONFIG, apiLogger } from './config'

// 请求选项接口
interface ApiRequestOptions extends RequestInit {
  timeout?: number
  retries?: number
  params?: Record<string, unknown>
  onRequest?: (url: string, options: RequestInit) => void
  onResponse?: (url: string, response: Response) => void
  onError?: (url: string, error: Error) => void
}

// 创建增强的fetch客户端
class ApiClient {
  private baseURL: string
  private defaultOptions: RequestInit

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  }

  // 增强的fetch方法
  async fetch<T = unknown>(
    endpoint: string, 
    options: ApiRequestOptions = {}
  ): Promise<T> {
    const {
      timeout = 10000,
      retries = 1,
      onRequest,
      onResponse,
      onError,
      ...fetchOptions
    } = options

    const url = `${this.baseURL}${endpoint}`
    const requestOptions: RequestInit = {
      ...this.defaultOptions,
      ...fetchOptions,
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const finalOptions = {
      ...requestOptions,
      signal: controller.signal,
    }

    let lastError: Error = new Error('Unknown error')

    // 重试逻辑
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // 记录请求开始
        apiLogger.logRequest(finalOptions.method || 'GET', url, finalOptions)
        onRequest?.(url, finalOptions)

        // 发送请求
        const response = await fetch(url, finalOptions)
        
        // 清除超时
        clearTimeout(timeoutId)

        // 记录响应
        onResponse?.(url, response)

        if (!response.ok) {
          const error = new Error(`HTTP ${response.status}: ${response.statusText}`)
          apiLogger.logError(url, error)
          throw error
        }

        // 解析响应数据
        const data = await response.json()
        
        // 记录成功响应
        apiLogger.logResponse(url, response, data)
        
        return data

      } catch (error) {
        lastError = error as Error
        
        // 如果是最后一次尝试，记录错误
        if (attempt === retries) {
          apiLogger.logError(url, lastError)
          onError?.(url, lastError)
        }
        
        // 如果不是网络错误或超时，不重试
        if (!this.shouldRetry(lastError)) {
          break
        }
        
        // 等待一段时间再重试
        if (attempt < retries) {
          await this.delay(Math.pow(2, attempt) * 1000) // 指数退避
        }
      }
    }

    throw lastError
  }

  // 判断是否应该重试
  private shouldRetry(error: Error): boolean {
    // 网络错误或超时错误可以重试
    return error.name === 'TypeError' || 
           error.name === 'AbortError' ||
           error.message.includes('fetch')
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // GET请求
  async get<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const params = new URLSearchParams()
    
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value))
        }
      })
    }

    const queryString = params.toString()
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint

    return this.fetch<T>(finalEndpoint, {
      ...options,
      method: 'GET',
    })
  }

  // POST请求
  async post<T = unknown>(endpoint: string, data: Record<string, unknown>, options: ApiRequestOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  // PUT请求
  async put<T = unknown>(endpoint: string, data: Record<string, unknown>, options: ApiRequestOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  }

  // DELETE请求
  async delete<T = unknown>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.fetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

// 创建默认的API客户端实例
export const apiClient = new ApiClient(API_CONFIG.BASE_URL)

// 导出类型
export type { ApiRequestOptions }
export { ApiClient } 