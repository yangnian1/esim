import type { Metadata } from 'next'
import { buildPageMetadata } from '@/lib/seo'

// 关于我们页是客户端组件（'use client'），**客户端组件不能导出 generateMetadata**。
// 所以 metadata 放在这个 layout 里 —— layout 是服务端组件，
// params 一样能拿到，生成的 title/canonical/hreflang 会应用到下面的 page。
// 这样就不用为了加 metadata 去拆那个页面。
const SEO_COPY = {
  de: {
    title: 'Über uns',
    description: 'Wer wir sind und wie wir eSIM-Tarife für Reisende vergleichen.',
  },
  en: {
    title: 'About us',
    description: 'Who we are and how we compare eSIM plans for travellers.',
  },
  zh: {
    title: '关于我们',
    description: '我们是谁，以及我们如何为旅行者对比 eSIM 套餐。',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  const { lng } = await params
  return buildPageMetadata({ lng, path: (l) => `/${l}/about-us`, copy: SEO_COPY })
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
