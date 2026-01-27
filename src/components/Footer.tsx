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
    </footer>
  )
} 