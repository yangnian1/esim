// 混合渲染版本 - 主体保持服务端渲染，语言切换使用客户端组件
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { languages } from '@/i18n/settings'
import { usePathname } from 'next/navigation'
import { UserMenu } from './UserMenu'

// 语言到国旗和名称的映射
const languageConfig: Record<string, { flag: string; name: string; nameEn: string }> = {
  en: { flag: 'https://flagcdn.com/w20/us.png', name: 'English', nameEn: 'English' },
  zh: { flag: 'https://flagcdn.com/w20/cn.png', name: '中文', nameEn: 'Chinese' },
  fr: { flag: 'https://flagcdn.com/w20/fr.png', name: 'Français', nameEn: 'French' },
  de: { flag: 'https://flagcdn.com/w20/de.png', name: 'Deutsch', nameEn: 'German' },
  es: { flag: 'https://flagcdn.com/w20/es.png', name: 'Español', nameEn: 'Spanish' },
  ja: { flag: 'https://flagcdn.com/w20/jp.png', name: '日本語', nameEn: 'Japanese' }
}

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    home: 'Home',
    orders: 'Orders',
    blog: 'Blog',
    about: 'About Us',
    contact: 'Contact Us'
  },
  zh: {
    home: '首页',
    orders: '订单',
    blog: '博客',
    about: '关于我们',
    contact: '联系我们'
  },
  fr: {
    home: 'Accueil',
    orders: 'Commandes',
    blog: 'Blog',
    about: 'À Propos',
    contact: 'Contactez-nous'
  },
  de: {
    home: 'Startseite',
    orders: 'Bestellungen',
    blog: 'Blog',
    about: 'Über Uns',
    contact: 'Kontakt'
  },
  es: {
    home: 'Inicio',
    orders: 'Pedidos',
    blog: 'Blog',
    about: 'Acerca de',
    contact: 'Contáctanos'
  },
  ja: {
    home: 'ホーム',
    orders: '注文',
    blog: 'ブログ',
    about: '私たちについて',
    contact: 'お問い合わせ'
  }
}

interface HeaderProps {
  lng: string
}

export function Header({ lng }: HeaderProps) {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname() // 使用Next.js的usePathname获取当前路径
  const languageDropdownRef = useRef<HTMLDivElement>(null)
  
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  
  const navLinks = [
    { href: `/${lng}`, label: t('home') },
    { href: `/${lng}/orders`, label: t('orders') },
    { href: `/${lng}/blog`, label: t('blog') },
    { href: `/${lng}/about-us`, label: t('about') },
    { href: `/${lng}/contact-us`, label: t('contact') },
  ]

  // 修复：正确处理语言切换的路径重定向
  const getRedirectedPath = (locale: string) => {
    if (!pathname) return `/${locale}`
    
    // 解析当前路径，替换语言代码
    const segments = pathname.split('/').filter(Boolean)
    
    if (segments.length === 0) {
      // 根路径
      return `/${locale}`
    }
    
    // 检查第一个段是否是语言代码
    if (languages.includes(segments[0])) {
      // 替换语言代码
      segments[0] = locale
      return `/${segments.join('/')}`
    } else {
      // 如果没有语言代码，添加语言代码
      return `/${locale}/${segments.join('/')}`
    }
  }

  // 更新语言链接，包含国旗和名称
  const languageLinks = languages.map((l) => ({
    href: getRedirectedPath(l),
    code: l,
    flag: languageConfig[l]?.flag || 'https://flagcdn.com/w20/xx.png',
    name: languageConfig[l]?.name || l.toUpperCase(),
    nameEn: languageConfig[l]?.nameEn || l.toUpperCase(),
  }))

  // 获取当前语言的配置
  const currentLanguageConfig = languageConfig[lng] || { 
    flag: 'https://flagcdn.com/w20/xx.png', 
    name: lng.toUpperCase(), 
    nameEn: lng.toUpperCase() 
  }

  // 点击外部区域关闭语言下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false)
      }
    }

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isLanguageDropdownOpen])

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50 w-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 min-w-0">
            <Link href={`/${lng}`} className="flex items-center gap-1 sm:gap-2">
              <Image
                src="/logo.png"
                alt="Hello eSIMs Logo"
                width={72}
                height={72}
                className="object-contain flex-shrink-0 -my-2"
                priority
              />
              <span className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Hello eSIMs</span>
            </Link>
          </div>
          
          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-600 hover:text-gray-900 transition-colors ${
                  pathname === link.href ? 'font-semibold text-gray-900' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* 用户菜单 */}
            <UserMenu lng={lng} />

            {/* 语言切换 - 客户端交互版本 */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              >
                <Image 
                  src={currentLanguageConfig.flag} 
                  alt={`${currentLanguageConfig.nameEn} flag`}
                  width={20} 
                  height={15} 
                  className="rounded-sm"
                />
                <span>{lng.toUpperCase()}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isLanguageDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                  {languageLinks.map((lang) => (
                    <Link 
                      key={lang.code} 
                      href={lang.href} 
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsLanguageDropdownOpen(false)}
                    >
                      <Image 
                        src={lang.flag} 
                        alt={`${lang.nameEn} flag`}
                        width={20} 
                        height={15} 
                        className="mr-3 rounded-sm"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-xs text-gray-500">{lang.nameEn}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
          
          {/* 移动端导航 */}
          <div className="md:hidden flex items-center gap-2">
            <UserMenu lng={lng} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {isMobileMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50 max-w-full overflow-hidden">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors truncate"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-1 border-gray-200" />
                {languageLinks.map((lang) => (
                  <Link 
                    key={lang.code} 
                    href={lang.href} 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Image 
                      src={lang.flag} 
                      alt={`${lang.nameEn} flag`}
                      width={16} 
                      height={12} 
                      className="mr-2 rounded-sm flex-shrink-0"
                    />
                    <span className="truncate">{lang.name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
