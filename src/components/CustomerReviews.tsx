'use client'

interface CustomerReviewsProps {
  lng: string
}

interface Review {
  id: number
  author: string
  rating: number
  title: string
  content: string
  date: string
}

export function CustomerReviews({ lng }: CustomerReviewsProps) {
  const reviews: Review[] = lng === 'zh' ? [
    {
      id: 1,
      author: "Dr.Jolin",
      rating: 5,
      title: "雪中送炭！",
      content: "我喜欢 21 世纪！你可以去遥远的国度旅行，在那里你会花费数百美元的互联网漫游费，或者也可以用两杯咖啡的价钱在几分钟内获得这个应用、一个 eSIM 和当地数据提供商的互联网服务！我喜欢在圣多明戈中部轻松刷交友应用，而周围的游客则在奋力寻找免费 Wi-Fi。",
      date: "2024-01-15"
    },
    {
      id: 2,
      author: "BCGregory",
      rating: 5,
      title: "非常愉快的体验！",
      content: "多年来，我到访过全球 45 个国家/地区。到目前为止，Airalo 是我发现的最简单、最实用、最经济有效的出国旅行选择。我不用再寻找当地 SIM 卡和更改号码，然后必须告知可能需要在我出国期间联系我的家人和朋友。无疑，我非常期待这样的服务，AIRALO 以出色的表现满足了每一位客户的需求！",
      date: "2024-01-10"
    },
    {
      id: 3,
      author: "David Schouten",
      rating: 5,
      title: "极其适合旅行者使用的应用！",
      content: "此款应用极其适合您在旅行中使用。他们的 eSIM 卡几乎涵盖世界上所有的国家/地区，定价和时长极为灵活。我使用过几次，十分满意。有几次是在月末使用的，当时我常用的运营商的数据流量用完了。从 Airalo 购买流量甚至比从我的运营商那里购买更便宜。建议您在启程前就安装 eSIM，这样在您抵达目的地后，就可以立即获得数据！",
      date: "2024-01-08"
    },
    {
      id: 4,
      author: "Levy Borromeo",
      rating: 5,
      title: "客户服务的确非常棒。",
      content: "我的咨询体验非常棒，响应迅速、详细、解答非常实用，我的问题很快得到了解决。而且，我在整个过程中都感受到心系客户。总体感受非常好，我对产品也非常满意。",
      date: "2024-01-05"
    }
  ] : [
    {
      id: 1,
      author: "Dr.Jolin",
      rating: 5,
      title: "A lifesaver!",
      content: "I love the 21st century! You can travel to distant lands where you would spend hundreds of dollars on internet roaming fees, or you can get this app, an eSIM, and local data provider internet service for the price of two cups of coffee in minutes! I love browsing dating apps easily in central Santo Domingo while tourists around me struggle to find free Wi-Fi.",
      date: "2024-01-15"
    },
    {
      id: 2,
      author: "BCGregory",
      rating: 5,
      title: "Very pleasant experience!",
      content: "Over the years, I have visited 45 countries/regions around the world. So far, Airalo is the simplest, most practical, and most cost-effective option I have found for international travel. I no longer have to look for local SIM cards and change numbers, then have to inform family and friends who might need to contact me while I'm abroad. Undoubtedly, I very much look forward to such services, and AIRALO has met every customer's needs with outstanding performance!",
      date: "2024-01-10"
    },
    {
      id: 3,
      author: "David Schouten",
      rating: 5,
      title: "Extremely suitable app for travelers!",
      content: "This app is extremely suitable for use during your travels. Their eSIM cards cover almost all countries/regions in the world, with very flexible pricing and duration. I have used it several times and am very satisfied. A few times I used it at the end of the month when my regular carrier's data was exhausted. Buying data from Airalo was even cheaper than buying from my carrier. I recommend installing the eSIM before departure so you can get data immediately upon arrival at your destination!",
      date: "2024-01-08"
    },
    {
      id: 4,
      author: "Levy Borromeo",
      rating: 5,
      title: "Customer service is indeed excellent.",
      content: "My consultation experience was excellent, with quick, detailed, and very practical responses. My issues were resolved quickly. Moreover, I felt customer-focused throughout the process. The overall experience was very good, and I am very satisfied with the product.",
      date: "2024-01-05"
    }
  ]

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