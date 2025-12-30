'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogImageProps {
  src: string
  alt: string
  caption?: string
}

// 检查图片 URL 是否是本地路径或已配置的域名
function isLocalOrConfigured(src: string): boolean {
  // 本地路径
  if (src.startsWith('/')) return true
  
  // 检查是否是已配置的域名
  try {
    const url = new URL(src)
    const hostname = url.hostname
    
    // 已配置的域名列表
    const configuredDomains = [
      'flagcdn.com',
      'supabase.co',
      'unsplash.com',
      'pexels.com',
      'imgur.com',
      'cloudinary.com',
      'example.com', // 临时添加，实际使用时应该移除
    ]
    
    // 检查是否是已配置的域名或其子域名
    return configuredDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    // 如果 URL 解析失败，假设是本地路径
    return true
  }
}

export function BlogImage({ src, alt, caption }: BlogImageProps) {
  const [imageError, setImageError] = useState(false)
  const [useFallback, setUseFallback] = useState(!isLocalOrConfigured(src))

  if (imageError) {
    return (
      <figure className="my-8">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">图片加载失败</p>
          </div>
        </div>
        {caption && (
          <figcaption className="text-sm text-gray-500 mt-3 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  // 如果域名未配置，使用普通的 img 标签
  if (useFallback) {
    return (
      <figure className="my-8">
        <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover rounded-lg"
            onError={() => setImageError(true)}
          />
        </div>
        {caption && (
          <figcaption className="text-sm text-gray-500 mt-3 text-center italic">
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <figure className="my-8">
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-200">
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          onError={() => {
            // 如果 Next.js Image 加载失败，尝试使用普通 img 标签
            setUseFallback(true)
          }}
        />
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-3 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

