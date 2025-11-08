import Link from 'next/link'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    orders: 'Orders',
    orders_description: 'View and manage your orders'
  },
  zh: {
    orders: '订单',
    orders_description: '查看和管理您的订单'
  }
}

export default async function Orders({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{t('orders')}</h1>
      <Link href={`/${lng}`}>
        Back to home
      </Link>
    </main>
  )
} 