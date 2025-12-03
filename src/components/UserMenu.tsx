'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut, Settings } from 'lucide-react'

interface UserMenuProps {
  lng: string
}

const translations: Record<string, Record<string, string>> = {
  en: {
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
  },
  vi: {
    login: 'Đăng nhập',
    register: 'Đăng ký',
    profile: 'Hồ sơ',
    settings: 'Cài đặt',
    logout: 'Đăng xuất',
  },
  de: {
    login: 'Anmelden',
    register: 'Registrieren',
    profile: 'Profil',
    settings: 'Einstellungen',
    logout: 'Abmelden',
  },
  zh: {
    login: '登录',
    register: '注册',
    profile: '个人资料',
    settings: '设置',
    logout: '退出',
  },
}

export function UserMenu({ lng }: UserMenuProps) {
  const { user, profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={`/${lng}/auth/login`}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        >
          {t('login')}
        </Link>
        <Link
          href={`/${lng}/auth/register`}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {t('register')}
        </Link>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
          {profile?.username?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="text-sm font-medium text-gray-700">
          {profile?.username || user.email}
        </span>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{profile?.username || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <Link
              href={`/${lng}/profile`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} />
              {t('profile')}
            </Link>

            <Link
              href={`/${lng}/settings`}
              className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              {t('settings')}
            </Link>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              {t('logout')}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
