import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

// 联系我们页是客户端组件（'use client'），**客户端组件不能导出 generateMetadata**。
// 所以 metadata 放在这个 layout 里 —— layout 是服务端组件，
// params 一样能拿到，生成的 title/canonical/hreflang 会应用到下面的 page。
// 这样就不用为了加 metadata 去拆那个页面。
const SEO_COPY = {
  de: {
    title: 'Kontakt',
    description: 'So erreichst du uns bei Fragen zu eSIM-Tarifen.',
  },
  en: {
    title: 'Contact',
    description: 'How to reach us with questions about eSIM plans.',
  },
  zh: {
    title: '联系我们',
    description: '有 eSIM 套餐相关问题可以这样联系我们。',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  const { lng } = await params
  return buildPageMetadata({ lng, path: (l) => `/${l}/contact-us`, copy: SEO_COPY })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
