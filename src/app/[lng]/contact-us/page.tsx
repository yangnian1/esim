'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

/**
 * ⚠️ 这个邮箱必须真的能收信。
 * 本页原来是从别的站点抄来的：公司名、老挝办公地址、WhatsApp 号、在线聊天窗口
 * 都不属于本站，邮箱字段甚至是字面量占位符。全部删掉了。
 *
 * TODO(法务)：德国 DDG §5 要求商业站点提供 Impressum（运营者姓名/地址/联系方式）。
 * 原来那份是假的，删了之后目前没有 Impressum —— 需要用真实主体信息补一个。
 */
const CONTACT_EMAIL = 'kontakt@helloesims.com'

const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Contact',
    subtitle: 'Questions about this site, an article, or a mistake you spotted.',
    description:
      'hello esims is a comparison site. We do not sell eSIMs and we do not have access to any booking — for questions about a plan you already bought, the provider is the right address.',
    email_label: 'Email',
    email_note: 'We usually reply within a few working days.',
    provider_label: 'Already bought a plan?',
    provider_desc:
      'Activation, billing, refunds and connection problems are handled by the provider you bought from — their support has your order, we do not.',
    correction_label: 'Spotted a mistake?',
    correction_desc:
      'Prices and rules change. If something on this site is out of date or wrong, write to us with the page address — we correct the article and note what changed.',
    disclosure_title: 'How this site is funded',
    disclosure_text:
      'Links to providers on this site are advertising links. If you book through one, we may earn a commission; the price stays the same for you. Those links are labelled where they appear.',
    back_to_home: 'Back to Home',
  },
  de: {
    title: 'Kontakt',
    subtitle: 'Fragen zu dieser Seite, zu einem Artikel – oder ein Fehler, der dir aufgefallen ist.',
    description:
      'hello esims ist eine Vergleichsseite. Wir verkaufen keine eSIMs und haben keinen Zugriff auf Buchungen – bei Fragen zu einem bereits gekauften Tarif ist der Anbieter die richtige Adresse.',
    email_label: 'E-Mail',
    email_note: 'Wir antworten in der Regel innerhalb weniger Werktage.',
    provider_label: 'Tarif schon gekauft?',
    provider_desc:
      'Aktivierung, Abrechnung, Erstattungen und Verbindungsprobleme klärt der Anbieter, bei dem du gebucht hast – dessen Support hat deine Bestellung, wir nicht.',
    correction_label: 'Fehler gefunden?',
    correction_desc:
      'Preise und Regeln ändern sich. Wenn etwas auf dieser Seite veraltet oder falsch ist, schreib uns mit der Seitenadresse – wir korrigieren den Artikel und schreiben dazu, was sich geändert hat.',
    disclosure_title: 'Wie sich diese Seite finanziert',
    disclosure_text:
      'Links zu Anbietern auf dieser Seite sind Werbelinks. Wenn du darüber buchst, erhalten wir unter Umständen eine Provision; für dich ändert sich der Preis nicht. Diese Links sind dort gekennzeichnet, wo sie stehen.',
    back_to_home: 'Zurück zur Startseite',
  },
  zh: {
    title: '联系我们',
    subtitle: '关于本站、某篇文章，或者你发现的错误。',
    description:
      'hello esims 是一个对比站点。我们不销售 eSIM，也无法查看任何订单 —— 已经买好的套餐有问题，请直接找供应商。',
    email_label: '邮箱',
    email_note: '通常几个工作日内回复。',
    provider_label: '已经买了套餐？',
    provider_desc: '激活、扣费、退款、连不上网这些问题由你下单的那家供应商处理 —— 订单在他们那边，不在我们这里。',
    correction_label: '发现内容有误？',
    correction_desc: '价格和规则会变。如果本站有内容过期或写错了，把页面地址发给我们 —— 我们会更正文章并说明改了什么。',
    disclosure_title: '本站如何维持运营',
    disclosure_text:
      '本站指向供应商的链接是广告链接。通过它下单，我们可能获得佣金，你支付的价格不变。这类链接在出现的位置都有标注。',
    back_to_home: '返回首页',
  },
}

export default function ContactUsPage({ params }: { params: Promise<{ lng: string }> }) {
  const [lng, setLng] = useState<string>('en')

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
        <div className="mb-8">
          <Link
            href={`/${lng}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            ← {t('back_to_home')}
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-700 mb-6">{t('subtitle')}</p>
            <p className="text-gray-600 leading-relaxed">{t('description')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* 邮件 —— 唯一真实存在的联系方式 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{t('email_label')}</h3>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-blue-600 hover:text-blue-800 text-center block break-all"
              >
                {CONTACT_EMAIL}
              </a>
              <p className="text-gray-500 text-sm text-center mt-2">{t('email_note')}</p>
            </div>

            {/* 已购套餐 —— 明确把售后指回供应商 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{t('provider_label')}</h3>
              <p className="text-gray-600 text-sm text-center">{t('provider_desc')}</p>
            </div>

            {/* 纠错 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{t('correction_label')}</h3>
              <p className="text-gray-600 text-sm text-center">{t('correction_desc')}</p>
            </div>
          </div>

          {/* 联盟披露 —— 广告标识要显著，不能只留在页脚 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('disclosure_title')}</h2>
            <p className="text-gray-700 leading-relaxed">{t('disclosure_text')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
