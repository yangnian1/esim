interface BannerProps {
  lng: string
}

export function Banner({ lng }: BannerProps) {
  return (
    <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {lng === 'zh' ? '无论您在哪里旅行，都能以实惠的价格保持连接' : 'Stay connected wherever you travel at affordable prices'}
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          {lng === 'zh' ? '我们的 eSIM 深受全球超过 20,000,000 人信赖' : 'Our eSIMs are trusted by over 20,000,000 people worldwide'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <span className="text-sm opacity-90">
              {lng === 'zh' ? '来自 300,000+ 条评价' : 'From 300,000+ reviews'}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
} 