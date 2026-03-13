import Image from 'next/image'

interface FigureProps {
  src: string
  alt: string
  caption?: string
  width: number
  height: number
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

export function Figure({ src, alt, caption, width, height }: FigureProps) {
  const useNextImage = isLocalOrConfigured(src)
  const aspectRatio = width / height

  return (
    <figure className="my-8 flex flex-col items-center">
      <div 
        className="relative w-full rounded-lg overflow-hidden bg-gray-200"
        style={{ 
          maxWidth: `${width}px`,
          aspectRatio: aspectRatio.toString()
        }}
      >
        {useNextImage ? (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="rounded-lg"
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-3 text-center italic max-w-2xl">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

