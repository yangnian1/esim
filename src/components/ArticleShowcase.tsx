// 服务端渲染版本 - 移除客户端状态
import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types'
import { CalendarIcon, UserIcon, TagIcon } from 'lucide-react'

interface ArticleShowcaseProps {
  articles: Article[]
  lng: string
  categories?: Array<{
    id: number
    name: string
    slug?: string
  }>
  selectedCategoryId?: number | null
}

// 获取文章缩略图
const getArticleThumbnail = (article: Article): string => {
  if (article.featured_image?.url) {
    return article.featured_image.url.startsWith('http') 
      ? article.featured_image.url 
      : `${process.env.NEXT_PUBLIC_API_URL}${article.featured_image.url}`
  }
  return 'https://via.placeholder.com/400x250?text=Article'
}

// 获取文章标题
const getArticleTitle = (article: Article, lng: string): string => {
  if (lng === 'zh' && article.title_zh) {
    return article.title_zh
  }
  return article.title || '无标题'
}

// 获取文章摘要
const getArticleExcerpt = (article: Article, lng: string): string => {
  if (lng === 'zh' && article.excerpt_zh) {
    return article.excerpt_zh
  }
  return article.excerpt || article.content?.substring(0, 150) + '...' || '暂无摘要'
}

// 格式化日期
const formatDate = (dateString: string, lng: string): string => {
  const date = new Date(dateString)
  if (lng === 'zh') {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function ArticleShowcase({ 
  articles, 
  lng, 
  categories = [], 
  selectedCategoryId = null 
}: ArticleShowcaseProps) {
  // 过滤文章
  const filteredArticles = selectedCategoryId 
    ? articles.filter(article => article.category_id === selectedCategoryId)
    : articles

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {lng === 'zh' ? '最新资讯' : 'Latest Articles'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {lng === 'zh' 
              ? '了解最新的eSIM技术和旅行资讯，让您的出行更加便捷' 
              : 'Stay updated with the latest eSIM technology and travel insights for seamless connectivity'
            }
          </p>
        </div>

        {/* 分类筛选 */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Link
              href={`/${lng}/blog`}
              className={`px-6 py-2 rounded-full transition-colors ${
                !selectedCategoryId 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {lng === 'zh' ? '全部' : 'All'}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${lng}/blog?category=${category.id}`}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategoryId === category.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}

        {/* 文章网格 */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.slice(0, 6).map((article) => (
              <article 
                key={article.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* 文章图片 */}
                <div className="relative h-48 bg-gray-200">
                  <Image
                    src={getArticleThumbnail(article)}
                    alt={getArticleTitle(article, lng)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* 文章内容 */}
                <div className="p-6">
                  {/* 元信息 */}
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4">{formatDate(article.published_at || article.publishedAt || article.created_at || article.createdAt || new Date().toISOString(), lng)}</span>
                    {article.author && (
                      <>
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{article.author}</span>
                      </>
                    )}
                  </div>

                  {/* 标题 */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                    <Link 
                      href={`/${lng}/blog/${article.slug || article.id}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {getArticleTitle(article, lng)}
                    </Link>
                  </h3>

                  {/* 摘要 */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {getArticleExcerpt(article, lng)}
                  </p>

                  {/* 标签 */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          <TagIcon className="h-3 w-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 阅读更多链接 */}
                  <Link 
                    href={`/${lng}/blog/${article.slug || article.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {lng === 'zh' ? '阅读更多' : 'Read More'}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {lng === 'zh' ? '暂无文章' : 'No Articles Found'}
            </h3>
            <p className="text-gray-600">
              {lng === 'zh' ? '当前分类下没有文章，请稍后再来查看' : 'No articles available in this category, please check back later'}
            </p>
          </div>
        )}

        {/* 查看更多按钮 */}
        {filteredArticles.length > 6 && (
          <div className="text-center mt-12">
            <Link 
              href={`/${lng}/blog`}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              {lng === 'zh' ? '查看全部文章' : 'View All Articles'}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
} 