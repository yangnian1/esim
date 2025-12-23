'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth-service'

const translations: Record<string, Record<string, string>> = {
  en: {
    register: 'Register',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    confirm_password: 'Confirm Password',
    register_button: 'Create Account',
    already_have_account: 'Already have an account?',
    login_link: 'Login here',
    registering: 'Creating account...',
    back_to_home: 'Back to Home',
    password_mismatch: 'Passwords do not match',
    success_message: 'Registration successful! Please check your email to verify your account.',
  },
  vi: {
    register: 'Đăng ký',
    username: 'Tên người dùng',
    email: 'Email',
    password: 'Mật khẩu',
    confirm_password: 'Xác nhận mật khẩu',
    register_button: 'Tạo tài khoản',
    already_have_account: 'Đã có tài khoản?',
    login_link: 'Đăng nhập ngay',
    registering: 'Đang tạo tài khoản...',
    back_to_home: 'Về Trang chủ',
    password_mismatch: 'Mật khẩu không khớp',
    success_message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác minh tài khoản.',
  },
  de: {
    register: 'Registrieren',
    username: 'Benutzername',
    email: 'E-Mail',
    password: 'Passwort',
    confirm_password: 'Passwort bestätigen',
    register_button: 'Konto erstellen',
    already_have_account: 'Bereits ein Konto?',
    login_link: 'Hier anmelden',
    registering: 'Konto wird erstellt...',
    back_to_home: 'Zurück zur Startseite',
    password_mismatch: 'Passwörter stimmen nicht überein',
    success_message: 'Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail, um Ihr Konto zu verifizieren.',
  },
  zh: {
    register: '注册',
    username: '用户名',
    email: '邮箱',
    password: '密码',
    confirm_password: '确认密码',
    register_button: '创建账号',
    already_have_account: '已有账号？',
    login_link: '立即登录',
    registering: '创建中...',
    back_to_home: '返回首页',
    password_mismatch: '密码不匹配',
    success_message: '注册成功！如果启用了邮箱验证，请检查您的邮箱。否则可以直接登录。',
  },
}

export default function RegisterPage({ params }: { params: Promise<{ lng: string }> }) {
  const [lng, setLng] = useState<string>('en')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
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
    setSuccess(false)

    // 验证密码匹配
    if (password !== confirmPassword) {
      setError(t('password_mismatch'))
      return
    }

    setLoading(true)

    console.log('开始注册...', { email, username })

    const { user, error: signUpError } = await signUp(email, password, username)

    console.log('注册结果:', { user, error: signUpError })

    if (signUpError) {
      console.error('注册错误:', signUpError)
      setError(signUpError)
      setLoading(false)
      return
    }

    if (user) {
      console.log('注册成功！用户:', user)
      setSuccess(true)
      setLoading(false)
      // 3秒后跳转到登录页
      setTimeout(() => {
        console.log('跳转到登录页...')
        router.push(`/${lng}/auth/login`)
      }, 3000)
    } else {
      console.warn('注册完成但没有返回用户对象')
      setError('Registration completed but no user returned. Please try logging in.')
      setLoading(false)
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

        {/* 注册表单 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t('register')}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {t('success_message')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                {t('username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="johndoe"
              />
            </div>

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
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirm_password')}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {loading ? t('registering') : t('register_button')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            {t('already_have_account')}{' '}
            <Link
              href={`/${lng}/auth/login`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {t('login_link')}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
