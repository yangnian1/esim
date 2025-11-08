'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Article } from '@/types'
import { apiUtils } from '@/lib/api'
import { LoadingOverlay } from './ui/LoadingOverlay'

interface BlogPreviewProps {
  articles: Article[]
  lng: string
}

export function BlogPreview({ articles, lng }: BlogPreviewProps) {
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
        message={lng === 'zh' ? '正在加载文章...' : 'Loading article...'}
        lng={lng}
        onCancel={handleCancelLoading}
      />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {lng === 'zh' ? '最新资讯' : 'Latest News'}
            </h2>
            <p className="text-lg text-gray-600">
              {lng === 'zh' ? '了解最新的旅行和技术资讯' : 'Stay updated with travel and tech insights'}
            </p>
          </div>
          
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {article.featured_image && (
                    <Image
                      src={apiUtils.getImageUrl(article.featured_image.url)}
                      alt={article.featured_image.alternativeText || article.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4">
                        {article.excerpt}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{apiUtils.formatDate(article.createdAt, lng === 'zh' ? 'zh-CN' : 'en-US')}</span>
                      <Link
                        href={`/${lng}/blog/${article.article_group_id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => handleArticleClick(article.article_group_id)}
                      >
                        {lng === 'zh' ? '阅读更多' : 'Read More'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {lng === 'zh' ? '暂无文章' : 'No articles available'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
} 