'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogFeaturedImageProps {
  src: string
  alt: string
}

// 检查图片 URL 是否是本地路径或已配置的域名
function isLocalOrConfigured(src: string): boolean {
  if (src.startsWith('/')) return true
  
  try {
    const url = new URL(src)
    const hostname = url.hostname
    
    const configuredDomains = [
      'flagcdn.com',
      'supabase.co',
      'unsplash.com',
      'pexels.com',
      'imgur.com',
      'cloudinary.com',
      'example.com',
    ]
    
    return configuredDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    )
  } catch {
    return true
  }
}

export function BlogFeaturedImage({ src, alt }: BlogFeaturedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [useFallback, setUseFallback] = useState(!isLocalOrConfigured(src))

  if (imageError) {
    return null // 图片加载失败时不显示
  }

  // 如果域名未配置，使用普通的 img 标签
  if (useFallback) {
    return (
      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-lg"
          onError={() => setImageError(true)}
        />
      </div>
    )
  }

  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-8 bg-gray-200">
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        className="rounded-lg"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority
        onError={() => {
          setUseFallback(true)
        }}
      />
    </div>
  )
}

