'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Article } from '@/types'
import { getImageUrl, formatDate } from '@/lib/mock-data'
import { LoadingOverlay } from './ui/LoadingOverlay'

interface ArticleListProps {
  articles: Article[]
  lng: string
}

export function ArticleList({ articles, lng }: ArticleListProps) {
  const [loadingArticleId, setLoadingArticleId] = useState<string | null>(null)

  const handleArticleClick = (articleId: string) => {
    setLoadingArticleId(articleId)
  }

  const handleCancelLoading = () => {
    setLoadingArticleId(null)
  }

  return (
    <>
      {/* 全屏Loading蒙版 */}
      <LoadingOverlay
        isVisible={!!loadingArticleId}
        message={lng === 'zh' ? '正在加载文章详情...' : 'Loading article details...'}
        lng={lng}
        onCancel={handleCancelLoading}
      />
      
      <div className="space-y-8">
        {articles.map((article) => {
          console.log('📝 渲染文章:', article.id, article.title, '语言:', article.locale)
          
          return (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <Link
                href={`/${lng}/blog/${article.id}`}
                className="block"
                onClick={() => handleArticleClick(article.id.toString())}
              >
                {article.featured_image?.url && (
                  <div className="relative h-48">
                    <Image
                      src={getImageUrl(article.featured_image.url)}
                      alt={article.featured_image.alternativeText || article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 hover:text-blue-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || article.content?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>By {article.author || 'Admin'}</span>
                    <span>{formatDate(article.createdAt || article.created_at, lng === 'zh' ? 'zh-CN' : 'en-US')}</span>
                  </div>
                </div>
              </Link>
            </article>
          )
        })}
      </div>
    </>
  )
} 