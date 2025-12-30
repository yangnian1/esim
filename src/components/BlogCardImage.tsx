'use client'

import { useState } from 'react'
import Image from 'next/image'

interface BlogCardImageProps {
  src: string | null
  alt: string
}

export function BlogCardImage({ src, alt }: BlogCardImageProps) {
  const [imageError, setImageError] = useState(false)

  // 如果没有图片或图片加载失败，显示占位色块
  if (!src || imageError) {
    return (
      <div className="relative h-48 w-full bg-gradient-to-br from-purple-400 to-purple-600">
      </div>
    )
  }

  return (
    <div className="relative h-48 w-full">
      <Image
        src={src}
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

