'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { languages } from '@/i18n/settings'

export const Footer = ({ lng }: { lng: string }) => {
  const pathname = usePathname()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  const triggerRevalidate = async () => {
    if (status === 'loading') return
    try {
      setStatus('loading')
      const res = await fetch('/api/revalidate', { method: 'POST' })
      if (!res.ok) {
        setStatus('error')
      } else {
        setStatus('done')
      }
    } catch {
      setStatus('error')
    } finally {
      window.setTimeout(() => setStatus('idle'), 3000)
    }
  }

  // 热门目的地（国家着陆页）
  const destinations = [
    { slug: 'esim-tuerkei', label: { en: 'eSIM Turkey', zh: '土耳其 eSIM', de: 'eSIM Türkei', fr: 'eSIM Turquie', es: 'eSIM Turquía', ja: 'eSIM トルコ' } },
  ]

  const footerT: Record<string, Record<string, string>> = {
    en: { destinations: 'Popular Destinations', navigation: 'Navigation', home: 'Home', products: 'Products', blog: 'Blog', about: 'About Us', contact: 'Contact Us' },
    zh: { destinations: '热门目的地', navigation: '导航', home: '首页', products: '产品', blog: '博客', about: '关于我们', contact: '联系我们' },
    de: { destinations: 'Beliebte Reiseziele', navigation: 'Navigation', home: 'Startseite', products: 'Produkte', blog: 'Blog', about: 'Über Uns', contact: 'Kontakt' },
    fr: { destinations: 'Destinations populaires', navigation: 'Navigation', home: 'Accueil', products: 'Produits', blog: 'Blog', about: 'À Propos', contact: 'Contact' },
    es: { destinations: 'Destinos populares', navigation: 'Navegación', home: 'Inicio', products: 'Productos', blog: 'Blog', about: 'Acerca de', contact: 'Contacto' },
    ja: { destinations: '人気の旅行先', navigation: 'ナビゲーション', home: 'ホーム', products: '製品', blog: 'ブログ', about: '私たちについて', contact: 'お問い合わせ' },
  }

  const ft = (key: string) => footerT[lng]?.[key] || footerT['en']?.[key] || key

  return (
    <footer className="w-full bg-gray-50 border-t mt-auto">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Footer Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{ft('navigation')}</h4>
            <ul className="space-y-2">
              <li><Link href={`/${lng}`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">{ft('home')}</Link></li>
              <li><Link href={`/${lng}/products`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">{ft('products')}</Link></li>
              <li><Link href={`/${lng}/blog`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">{ft('blog')}</Link></li>
              <li><Link href={`/${lng}/about-us`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">{ft('about')}</Link></li>
              <li><Link href={`/${lng}/contact-us`} className="text-gray-600 hover:text-gray-900 text-sm transition-colors">{ft('contact')}</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">{ft('destinations')}</h4>
            <ul className="space-y-2">
              {destinations.map((dest) => (
                <li key={dest.slug}>
                  <Link
                    href={`/${lng}/${dest.slug}`}
                    className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                  >
                    {dest.label[lng as keyof typeof dest.label] || dest.label.en}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Language Switcher */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Language</h4>
            <div className="flex flex-wrap gap-2">
              {languages.map((l) => (
                <Link
                  key={l}
                  href={redirectedPathName(l)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors ${
                    l === lng
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {l.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} hello esims. All rights{' '}
            <button
              type="button"
              onClick={triggerRevalidate}
              className="underline underline-offset-2 hover:text-gray-700 disabled:opacity-60"
              disabled={status === 'loading'}
              title="Rebuild now"
            >
              reserved
            </button>
            .
          </p>
          {status === 'done' ? (
            <p className="text-xs text-emerald-600 mt-2">Updated.</p>
          ) : null}
          {status === 'error' ? (
            <p className="text-xs text-red-600 mt-2">Update failed.</p>
          ) : null}
        </div>
      </div>
    </footer>
  )
} 