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
      {/*
        点击打开原图。示意图和截图在手机上会被缩到很小，
        必须给读者一个看清楚的出口。用普通链接而不是 JS 灯箱：
        零依赖、不影响静态化，长按保存、新标签页打开这些系统行为也都还在。
      */}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${alt} —— 点击查看原图`}
        className="group relative block w-full"
        style={{ maxWidth: `${width}px` }}
      >
        <div
          className="relative w-full rounded-lg overflow-hidden bg-gray-100"
          style={{ aspectRatio: aspectRatio.toString() }}
        >
          {useNextImage ? (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="rounded-lg"
              // contain 而不是 cover：示意图和截图必须完整显示，
              // cover 会把超出容器比例的部分裁掉，图里的信息就丢了
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="w-full h-full object-contain rounded-lg"
            />
          )}
        </div>
        <span className="pointer-events-none absolute bottom-2 right-2 rounded bg-black/55 px-2 py-1 text-xs text-white opacity-80 transition-opacity group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100">
          Zum Vergrößern tippen
        </span>
      </a>
      {caption && (
        <figcaption className="text-sm text-gray-500 mt-3 text-center italic max-w-2xl">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

