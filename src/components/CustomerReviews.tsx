'use client'

/**
 * 用户评价展示组件。
 *
 * ⚠️ 只允许传入真实的、本站自己收集到的用户评价。
 * 不要放竞品（Airalo / Holafly / Saily 等）的评价，也不要放编造的评价：
 *  - Google 对伪造评价有明确的垃圾内容政策，会影响整站信任度；
 *  - 欧盟消费者保护指令与德国 UWG 对虚假评价的处罚很严，德国还有
 *    Abmahnung（警告信）这套成熟的私人执法，而德语正是本站的主攻市场。
 *
 * 在拿到真实评价之前，请保持不传 reviews（组件会直接不渲染）。
 */

export interface Review {
  id: number | string
  author: string
  rating: number
  title: string
  content: string
  /** ISO 日期字符串，例如 '2026-03-14' */
  date: string
}

interface CustomerReviewsProps {
  lng: string
  /** 真实用户评价；为空时组件不渲染任何内容 */
  reviews?: Review[]
}

export function CustomerReviews({ lng, reviews = [] }: CustomerReviewsProps) {
  if (reviews.length === 0) {
    return null
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return lng === 'zh'
      ? date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">
                  {review.author.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{review.author}</h4>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <time className="text-gray-500 text-xs">
              {formatDate(review.date)}
            </time>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">
            {review.title}
          </h3>

          <p className="text-gray-600 text-sm leading-relaxed">
            {review.content}
          </p>
        </div>
      ))}
    </div>
  )
}
