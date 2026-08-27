'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { languages } from '@/i18n/settings'
import { isImpressumConfigured } from '@/lib/legal'

export const Footer = ({ lng }: { lng: string }) => {
  const pathname = usePathname()

  const redirectedPathName = (locale: string) => {
    if (!pathname) return '/'
    const segments = pathname.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  return (
    <footer className="w-full bg-gray-50 border-t mt-auto">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
        {/* 只剩一个语种时整行不渲染 —— 「Language: DE」是没有作用的界面 */}
        {languages.length > 1 && (
        <div className="flex justify-center items-center">
          <span className="text-gray-600">Language:</span>
          {languages.map((l, index) => (
            <span key={l} className="flex items-center">
              {index > 0 && <span className="text-gray-400 mx-2">|</span>}
              <Link
                href={redirectedPathName(l)}
                className={`ml-2 ${l === lng ? 'text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {l.toUpperCase()}
              </Link>
            </span>
          ))}
        </div>
        )}
        {/*
          DDG §5 要求 Impressum 在两次点击内可达，所以入口放页脚、每页都有。
          填齐 lib/legal.ts 之前不渲染 —— 那时页面本身也是 404，
          给一个打不开的链接比不给更糟。
        */}
        <div className="flex justify-center items-center gap-4 mt-4 text-sm">
          <Link href={`/${lng}/about-us`} className="text-gray-500 hover:text-gray-800">
            Über uns
          </Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lng}/contact-us`} className="text-gray-500 hover:text-gray-800">
            Kontakt
          </Link>
          {isImpressumConfigured() && (
            <>
              <span className="text-gray-300">|</span>
              <Link href={`/${lng}/impressum`} className="text-gray-500 hover:text-gray-800">
                Impressum
              </Link>
            </>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} hello esims. All rights reserved.
        </p>
      </div>
    </footer>
  )
} 