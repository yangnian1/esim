'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth-service'

const translations: Record<string, Record<string, string>> = {
  en: {
    login: 'Login',
    email: 'Email',
    password: 'Password',
    login_button: 'Sign In',
    no_account: "Don't have an account?",
    register_link: 'Register here',
    logging_in: 'Logging in...',
    back_to_home: 'Back to Home',
  },
  vi: {
    login: 'Đăng nhập',
    email: 'Email',
    password: 'Mật khẩu',
    login_button: 'Đăng nhập',
    no_account: 'Chưa có tài khoản?',
    register_link: 'Đăng ký ngay',
    logging_in: 'Đang đăng nhập...',
    back_to_home: 'Về Trang chủ',
  },
  de: {
    login: 'Anmelden',
    email: 'E-Mail',
    password: 'Passwort',
    login_button: 'Anmelden',
    no_account: 'Noch kein Konto?',
    register_link: 'Hier registrieren',
    logging_in: 'Anmeldung läuft...',
    back_to_home: 'Zurück zur Startseite',
  },
  zh: {
    login: '登录',
    email: '邮箱',
    password: '密码',
    login_button: '登录',
    no_account: '还没有账号？',
    register_link: '立即注册',
    logging_in: '登录中...',
    back_to_home: '返回首页',
  },
}

export default function LoginPage({ params }: { params: Promise<{ lng: string }> }) {
  const [lng, setLng] = useState<string>('en')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // 使用 useEffect 解析 params
  useEffect(() => {
    let isMounted = true
    params.then(p => {
      if (isMounted) {
        setLng(p.lng)
      }
    })
    return () => {
      isMounted = false
    }
  }, [params])

  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('开始登录...', { email })

    const { user, error: signInError } = await signIn(email, password)

    console.log('登录结果:', { user, error: signInError })

    if (signInError) {
      console.error('登录错误:', signInError)

      // 友好的错误提示
      if (signInError.includes('email_not_confirmed') || signInError.includes('Email not confirmed')) {
        setError('邮箱未验证。请检查您的邮箱或联系管理员。')
      } else if (signInError.includes('Invalid login credentials')) {
        setError('邮箱或密码错误，请检查后重试。')
      } else {
        setError(signInError)
      }

      setLoading(false)
      return
    }

    if (user) {
      console.log('登录成功！跳转到首页...')
      router.push(`/${lng}`)
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 返回首页链接 */}
        <div className="text-center mb-8">
          <Link
            href={`/${lng}`}
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            ← {t('back_to_home')}
          </Link>
        </div>

        {/* 登录表单 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('login')}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? t('logging_in') : t('login_button')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {t('no_account')}{' '}
            <Link
              href={`/${lng}/auth/register`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('register_link')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
