'use client'

import { useEffect } from 'react'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  lng?: string
  onCancel?: () => void
}

export function LoadingOverlay({ 
  isVisible, 
  message, 
  lng = 'zh',
  onCancel 
}: LoadingOverlayProps) {
  // 阻止背景滚动
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    // 清理函数
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isVisible])

  if (!isVisible) return null

  const defaultMessage = lng === 'zh' ? '加载中...' : 'Loading...'

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 背景蒙版 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onCancel}
      />
      
      {/* Loading内容 */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 md:p-8 mx-4 max-w-sm w-full">
        <div className="flex flex-col items-center space-y-4">
          {/* 旋转动画 */}
          <div className="relative">
            {/* 外圈 */}
            <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-gray-200 rounded-full"></div>
            {/* 旋转圈 */}
            <div className="absolute top-0 left-0 w-16 h-16 md:w-20 md:h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            {/* 中心点 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
          </div>
          
          {/* 加载文字 */}
          <div className="text-center">
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
              {message || defaultMessage}
            </p>
            <p className="text-sm text-gray-500">
              {lng === 'zh' ? '请稍候...' : 'Please wait...'}
            </p>
          </div>
          
          {/* 取消按钮（可选） */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {lng === 'zh' ? '取消' : 'Cancel'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 