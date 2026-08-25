import type { Metadata } from 'next'
import './globals.css'
import { NotFoundContent } from '@/components/NotFoundContent'

/**
 * 完全没匹配上任何路由时的 404。
 *
 * 为什么需要这个文件：本项目的根布局是 `app/[lng]/layout.tsx` ——
 * 一个**顶层动态段**。Next 在 URL 压根没匹配上时拿不到 `[lng]` 的值，
 * 也就没法渲染那个布局，于是普通的 not-found.tsx 用不上，只能回退到内置的白底 404。
 * 官方文档把这种情况明确列为 global-not-found 的适用场景。
 *
 * ⚠️ 它**绕过布局**，所以必须自己返回完整的 <html><body>，
 * 也必须自己 import globals.css。这里没有 Header / Footer，是预期行为。
 *
 * 依赖 next.config.ts 里的 experimental.globalNotFound = true，删了就会退回内置页面。
 */
export const metadata: Metadata = {
  title: '404',
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <NotFoundContent />
      </body>
    </html>
  )
}
