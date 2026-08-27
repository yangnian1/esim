'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * 图片灯箱。点击在**当前页面**打开全屏查看，而不是新开标签页。
 *
 * 设计取舍：
 * - 外层仍然是真正的 <a href={src}>，JS 用 preventDefault 接管。
 *   没有 JS（或还没 hydrate）时它退化成"打开原图"，功能不丢。
 * - 只有这个小组件是客户端组件，页面本身照样静态生成。
 * - 全屏层里用原生 <img> 显示原图：反正要看的就是完整分辨率，
 *   再经 next/image 缩放一遍没有意义。
 * - 不自己实现缩放手势。页面 viewport 没有禁用缩放，
 *   浏览器原生的双指缩放比任何手写实现都可靠。
 */
interface ImageLightboxProps {
  src: string
  alt: string
  caption?: string
  children: ReactNode
  className?: string
}

export function ImageLightbox({ src, alt, caption, children, className }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // 打开时锁滚动 + Esc 关闭
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <a
        href={src}
        className={className}
        aria-label={`${alt} — vergrößern`}
        onClick={(e) => {
          // 让 Cmd/Ctrl/中键点击保持"新标签页打开"的原生行为
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          setOpen(true)
        }}
      >
        {children}
      </a>

      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Schließen"
              className="absolute right-4 top-4 z-10 rounded-full bg-white/15 px-4 py-2 text-2xl leading-none text-white hover:bg-white/25"
            >
              ×
            </button>

            <div className="flex flex-1 items-center justify-center overflow-auto p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-full max-w-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {caption && (
              <p className="px-6 pb-6 text-center text-sm text-white/80">{caption}</p>
            )}
          </div>,
          document.body
        )}
    </>
  )
}
