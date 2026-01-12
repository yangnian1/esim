'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { languages } from '@/i18n/settings'

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
        <p className="text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} hello esims. All rights reserved.
        </p>
      </div>
    </footer>
  )
} 