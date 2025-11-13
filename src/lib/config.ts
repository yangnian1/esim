// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
}

// API Logger for debugging
export const apiLogger = {
  logRequest: (method: string, url: string, options: RequestInit) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${method} ${url}`, options)
    }
  },
  logResponse: (url: string, response: Response, data: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${url}`, { status: response.status, data })
    }
  },
  logError: (url: string, error: Error) => {
    console.error(`[API Error] ${url}`, error)
  },
}

// Image URL helper
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '/placeholder.png'
  if (imageUrl.startsWith('http')) return imageUrl
  return `${API_CONFIG.BASE_URL}${imageUrl}`
}
