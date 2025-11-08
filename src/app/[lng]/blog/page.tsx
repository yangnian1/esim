import { articlesApi } from '@/lib/api'
import { Article } from '@/types'
import { ArticleList } from '@/components/ArticleList'

// 静态翻译映射
const translations: Record<string, Record<string, string>> = {
  en: {
    blog: 'Blog',
    back_to_home: 'Back to Home'
  },
  zh: {
    blog: '博客',
    back_to_home: '返回首页'
  }
}

export default async function Blog({ params }: { params: Promise<{ lng: string }> }) {
  const { lng } = await params
  const t = (key: string) => translations[lng]?.[key] || translations['en']?.[key] || key
  
  console.log('📰 Blog 页面开始加载，语言:', lng)
  
  // 获取文章数据
  let articles: Article[] = []
  let error: string | null = null
  
  try {
    console.log('📄 开始获取文章数据...')
    // 改用与首页相同的API调用方式，确保数据一致性
    const response = await articlesApi.getLatest(lng, 10)
    articles = response.data
    console.log('✅ 文章数据获取成功，数量:', articles.length)
    console.log('📊 文章数据预览:', articles.slice(0, 2)) // 只显示前2篇文章
  } catch (err) {
    console.error('❌ 获取文章失败:', err)
    error = '获取文章数据失败'
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-4xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-12">{t('blog')}</h1>
        
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-500">请确保 Strapi 后端服务正在运行 (http://localhost:1337)</p>
            <p className="text-gray-500 mt-2">并且文章内容支持当前语言: {lng}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无 {lng === 'zh' ? '中文' : '英文'} 文章数据</p>
          </div>
        ) : (
          <ArticleList articles={articles} lng={lng} />
        )}
      </div>
    </main>
  )
} 