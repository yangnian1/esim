'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Contact us',
    subtitle: 'You can contact our support team 24/7 and 365 days per year.',
    description: 'Simply send a message to our email or talk with us via online chat:',
    email_label: 'Email',
    email_value: '[email protected]',
    chat_label: 'Chat',
    chat_description: 'Just click the purple pop-up in the bottom right hand corner of our website.',
    whatsapp_label: 'WhatsApp 24/7',
    whatsapp_value: '+1 276-288-8688',
    office_title: 'Visit our Head Office in Vientiane, Laos:',
    office_address: 'Vientiane Center, Ban Nonesavang, Unit 15, Chanthaboury District, Vientiane Capital, Laos',
    company_name: 'LaoseSIM Limited',
    back_to_home: 'Back to Home',
  },
  vi: {
    title: 'Liên hệ chúng tôi',
    subtitle: 'Bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi 24/7 và 365 ngày mỗi năm.',
    description: 'Chỉ cần gửi tin nhắn đến email của chúng tôi hoặc trò chuyện với chúng tôi qua chat trực tuyến:',
    email_label: 'Email',
    email_value: '[email protected]',
    chat_label: 'Chat',
    chat_description: 'Chỉ cần nhấp vào cửa sổ bật lên màu tím ở góc dưới bên phải của trang web của chúng tôi.',
    whatsapp_label: 'WhatsApp 24/7',
    whatsapp_value: '+1 276-288-8688',
    office_title: 'Ghé thăm Văn phòng Chính của chúng tôi tại Vientiane, Lào:',
    office_address: 'Vientiane Center, Ban Nonesavang, Unit 15, Chanthaboury District, Vientiane Capital, Laos',
    company_name: 'LaoseSIM Limited',
    back_to_home: 'Về Trang Chủ',
  },
  de: {
    title: 'Kontaktieren Sie uns',
    subtitle: 'Sie können unser Support-Team 24/7 und 365 Tage im Jahr kontaktieren.',
    description: 'Senden Sie einfach eine Nachricht an unsere E-Mail oder sprechen Sie mit uns über den Online-Chat:',
    email_label: 'E-Mail',
    email_value: '[email protected]',
    chat_label: 'Chat',
    chat_description: 'Klicken Sie einfach auf das lila Pop-up in der unteren rechten Ecke unserer Website.',
    whatsapp_label: 'WhatsApp 24/7',
    whatsapp_value: '+1 276-288-8688',
    office_title: 'Besuchen Sie unsere Hauptgeschäftsstelle in Vientiane, Laos:',
    office_address: 'Vientiane Center, Ban Nonesavang, Unit 15, Chanthaboury District, Vientiane Capital, Laos',
    company_name: 'LaoseSIM Limited',
    back_to_home: 'Zurück zur Startseite',
  },
  zh: {
    title: '联系我们',
    subtitle: '您可以全年 365 天、每天 24 小时联系我们的支持团队。',
    description: '只需发送邮件或通过在线聊天与我们联系：',
    email_label: '邮箱',
    email_value: '[email protected]',
    chat_label: '在线聊天',
    chat_description: '只需点击我们网站右下角的紫色弹窗。',
    whatsapp_label: 'WhatsApp 24/7',
    whatsapp_value: '+1 276-288-8688',
    office_title: '访问我们在老挝万象的总部：',
    office_address: 'Vientiane Center, Ban Nonesavang, Unit 15, Chanthaboury District, Vientiane Capital, Laos',
    company_name: 'LaoseSIM Limited',
    back_to_home: '返回首页',
  },
}

export default function ContactUsPage({ params }: { params: Promise<{ lng: string }> }) {
  const [lng, setLng] = useState<string>('en')

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

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* 返回首页链接 */}
        <div className="mb-8">
          <Link
            href={`/${lng}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            ← {t('back_to_home')}
          </Link>
        </div>

        {/* 主要内容 */}
        <div className="max-w-4xl mx-auto">
          {/* 标题部分 */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-700 mb-6">
              {t('subtitle')}
            </p>
            <p className="text-gray-600">
              {t('description')}
            </p>
          </div>

          {/* 联系方式卡片 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Email */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {t('email_label')}
              </h3>
              <a
                href="mailto:[email protected]"
                className="text-blue-600 hover:text-blue-800 text-center block break-all"
              >
                {t('email_value')}
              </a>
            </div>

            {/* Chat */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {t('chat_label')}
              </h3>
              <p className="text-gray-600 text-sm text-center">
                {t('chat_description')}
              </p>
            </div>

            {/* WhatsApp */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                {t('whatsapp_label')}
              </h3>
              <a
                href="https://wa.me/12762888688"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 text-center block font-medium"
              >
                {t('whatsapp_value')}
              </a>
            </div>
          </div>

          {/* 总部地址 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('office_title')}
            </h2>
            <div className="flex items-start">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  {t('company_name')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('office_address')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


