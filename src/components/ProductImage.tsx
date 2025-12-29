'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageProps {
  imageUrl: string | null
  alt: string
  country: string | null
  className?: string
}

export function ProductImage({ imageUrl, alt, country, className = '' }: ProductImageProps) {
  const [imageError, setImageError] = useState(false)

  // 如果没有图片 URL 或图片加载失败，显示占位符
  if (!imageUrl || imageError) {
    return (
      <div className={`relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold">
          {country || 'eSIM'}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        style={{ objectFit: 'cover' }}
        className="transition-transform duration-300 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setImageError(true)}
      />
    </div>
  )
}

