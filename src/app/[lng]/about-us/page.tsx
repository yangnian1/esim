'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'About us',
    subtitle: 'What hello esims is – and what it is not',
    tagline: 'An independent comparison for travel eSIMs',
    description: 'hello esims is a comparison and guide site for travel eSIMs. We do not sell eSIMs ourselves and we do not issue any cards – we compare plans, explain the setup and link to the providers.',
    description2: 'If you book through one of our links we may earn a commission. The price stays the same for you. Such links are marked as advertising on the page.',
    guarantee: 'An independent comparison, not a sales pitch',
    features_title: 'What you will find here',
    feature_online: 'Plan comparison',
    feature_online_desc: 'Data volume, validity and price of the available plans at a glance.',
    feature_coverage: 'Guides',
    feature_coverage_desc: 'Step by step to a working eSIM – for iPhone and Android.',
    feature_easy: 'Context',
    feature_easy_desc: 'How much data you actually need and what to watch out for in a plan.',
    mission_title: 'What we do',
    mission_text: 'eSIM plans are hard to compare: different durations, data allowances and conditions. We present that information so you can decide in a few minutes – and we say what we are not sure about.',
    vision_title: 'How we work',
    vision_text: 'We only state what can be supported: data volume, validity, price and host network come from the providers. Where rules can change – regulatory topics for instance – we say so instead of presenting it as settled.',
    why_title: 'Why this site',
    why_no_remove: 'Focused on one country',
    why_no_remove_desc: 'Instead of covering a hundred countries superficially, we go deep on one destination – currently Turkey.',
    why_various: 'Written in German',
    why_various_desc: 'Written for travellers from German-speaking countries, not machine-translated from English.',
    why_digital: 'Prices come from a plan table',
    why_digital_desc: 'Prices are not in the body text but in a table – so they do not go stale unnoticed inside an article.',
    why_saving: 'Transparently funded',
    why_saving_desc: 'This site is funded through commissions from advertising links. That is stated at every such link, not only in the fine print.',
    why_support: 'No support for booked plans',
    why_support_desc: 'For questions about a booked plan the provider is responsible – we have no access to your booking.',
    values_title: 'What we hold to',
    value_customer: 'No invented reviews',
    value_customer_desc: 'This site carries no user reviews that we did not collect ourselves.',
    value_reliability: 'No superlatives without evidence',
    value_reliability_desc: 'We do not use wording like "best provider" or "number one" unless we can support it.',
    value_integrity: 'Advertising is labelled',
    value_integrity_desc: 'Every link to a provider is marked as advertising – visibly for you and technically for search engines.',
    value_innovation: 'Correct, do not delete',
    value_innovation_desc: 'If something turns out to be wrong we correct the article and note what changed.',
    international_title: 'Current state',
    international_text: 'This site is being built. The focus is currently on eSIM plans for Turkey; more destinations will follow once we can cover them in the same depth.',
    convinced_title: 'Questions?',
    convinced_text: 'Write to us – about this site, an article, or if you spot a mistake.',
    contact_us: 'Get in touch',
    back_to_home: 'Back to homepage',
  },
  zh: {
    title: '关于我们',
    subtitle: 'hello esims 是什么，不是什么',
    tagline: '独立的旅行 eSIM 对比站',
    description: 'hello esims 是一个旅行 eSIM 的对比与指南站点。我们自己不销售 eSIM、不发卡，只做套餐对比、讲解安装步骤，并链接到各家供应商。',
    description2: '通过我们的链接下单，我们可能获得佣金，你支付的价格不会因此变化。这类链接在页面上都标注为广告链接。',
    guarantee: '独立对比，不是推销',
    features_title: '这里有什么',
    feature_online: '套餐对比',
    feature_online_desc: '流量、有效期、价格一目了然。',
    feature_coverage: '使用指南',
    feature_coverage_desc: '一步步装好 eSIM —— iPhone 和 Android 都有。',
    feature_easy: '选购判断',
    feature_easy_desc: '到底需要多少流量，选套餐要注意什么。',
    mission_title: '我们做什么',
    mission_text: 'eSIM 套餐很难横向比较：时长、流量、条款各不相同。我们把这些信息整理成几分钟内能做决定的形式 —— 并且会写明哪些我们也不确定。',
    vision_title: '我们怎么做',
    vision_text: '只陈述能有依据的内容：流量、有效期、价格、承载网络都来自供应商的公开信息。涉及可能变动的规则（比如监管政策），我们会写明不确定性，而不是当作定论。',
    why_title: '为什么做这个站',
    why_no_remove: '专注一个国家',
    why_no_remove_desc: '与其浅尝辄止地覆盖一百个国家，不如把一个目的地做透 —— 目前是土耳其。',
    why_various: '用德语写',
    why_various_desc: '面向德语区旅行者撰写，不是从英文机器翻译过来的。',
    why_digital: '价格来自套餐表',
    why_digital_desc: '价格不写在正文里，而是来自套餐表 —— 这样不会在文章里悄悄过期。',
    why_saving: '收入来源透明',
    why_saving_desc: '本站通过广告链接的佣金维持运营。这一点标注在每个此类链接旁边，而不是藏在细则里。',
    why_support: '不提供套餐售后',
    why_support_desc: '已购套餐的问题请联系对应供应商 —— 我们无法查看你的订单。',
    values_title: '我们的原则',
    value_customer: '不编造用户评价',
    value_customer_desc: '本站不放任何我们没有真实收集过的用户评价。',
    value_reliability: '没有依据不用最高级',
    value_reliability_desc: '在拿不出依据之前，不使用「最好的供应商」「第一」这类说法。',
    value_integrity: '广告必须标明',
    value_integrity_desc: '每一个指向供应商的链接都标注为广告链接 —— 你看得见，搜索引擎也识别得到。',
    value_innovation: '出错就更正，不删帖',
    value_innovation_desc: '如果发现内容有误，我们更正文章并说明改了什么。',
    international_title: '当前进展',
    international_text: '本站仍在建设中。目前重点是土耳其的 eSIM 套餐；等我们能以同样的深度覆盖时，会陆续加入其他目的地。',
    convinced_title: '有问题？',
    convinced_text: '欢迎联系我们 —— 关于本站、某篇文章，或者你发现了错误。',
    contact_us: '联系我们',
    back_to_home: '返回首页',
  },
  de: {
    title: 'Über uns',
    subtitle: 'Was hello esims ist – und was nicht',
    tagline: 'Ein unabhängiger Vergleich für Reise-eSIMs',
    description: 'hello esims ist eine Vergleichs- und Ratgeberseite für Reise-eSIMs. Wir verkaufen selbst keine eSIMs und geben keine Karten aus – wir stellen Tarife gegenüber, erklären die Einrichtung und verlinken zu den Anbietern.',
    description2: 'Wenn du über einen unserer Links buchst, erhalten wir unter Umständen eine Provision. Für dich ändert sich der Preis dadurch nicht. Solche Links sind auf der Seite als Werbelinks gekennzeichnet.',
    guarantee: 'Unabhängiger Vergleich statt Verkaufsgespräch',
    features_title: 'Was du hier findest',
    feature_online: 'Tarifvergleich',
    feature_online_desc: 'Datenvolumen, Laufzeit und Preis der verfügbaren Tarife auf einen Blick.',
    feature_coverage: 'Anleitungen',
    feature_coverage_desc: 'Schritt für Schritt zur eingerichteten eSIM – für iPhone und Android.',
    feature_easy: 'Einordnung',
    feature_easy_desc: 'Wie viel Datenvolumen du wirklich brauchst und worauf du beim Tarif achten solltest.',
    mission_title: 'Unsere Aufgabe',
    mission_text: 'eSIM-Tarife sind schwer vergleichbar: unterschiedliche Laufzeiten, Datenmengen und Bedingungen. Wir bereiten diese Informationen so auf, dass du in wenigen Minuten entscheiden kannst – und schreiben dazu, was wir nicht sicher wissen.',
    vision_title: 'Wie wir arbeiten',
    vision_text: 'Wir nennen nur, was sich belegen lässt: Datenvolumen, Laufzeit, Preis und Trägernetz stammen aus den Angaben der Anbieter. Wo sich Regeln ändern können – etwa bei regulatorischen Themen – schreiben wir das dazu, statt es als feststehend darzustellen.',
    why_title: 'Warum diese Seite',
    why_no_remove: 'Auf ein Land fokussiert',
    why_no_remove_desc: 'Statt oberflächlich über hundert Länder zu schreiben, gehen wir bei einem Reiseziel in die Tiefe – aktuell die Türkei.',
    why_various: 'Auf Deutsch geschrieben',
    why_various_desc: 'Für Reisende aus dem deutschsprachigen Raum geschrieben, nicht maschinell aus dem Englischen übersetzt.',
    why_digital: 'Preise aus der Tarifübersicht',
    why_digital_desc: 'Preise stehen nicht im Fließtext, sondern kommen aus einer Übersicht – so veralten sie nicht unbemerkt im Artikel.',
    why_saving: 'Transparent finanziert',
    why_saving_desc: 'Diese Seite finanziert sich über Provisionen aus Werbelinks. Das steht an jedem solchen Link, nicht nur im Kleingedruckten.',
    why_support: 'Kein Support für gebuchte Tarife',
    why_support_desc: 'Bei Fragen zu einem gebuchten Tarif ist der jeweilige Anbieter zuständig – wir haben keinen Zugriff auf deine Buchung.',
    values_title: 'Woran wir uns halten',
    value_customer: 'Keine erfundenen Bewertungen',
    value_customer_desc: 'Auf dieser Seite stehen keine Nutzerbewertungen, die wir nicht selbst erhoben haben.',
    value_reliability: 'Keine Superlative ohne Beleg',
    value_reliability_desc: 'Formulierungen wie „bester Anbieter" oder „Nummer eins" verwenden wir nicht, solange wir sie nicht belegen können.',
    value_integrity: 'Werbung wird gekennzeichnet',
    value_integrity_desc: 'Jeder Link zu einem Anbieter ist als Werbelink markiert – sichtbar für dich und technisch für Suchmaschinen.',
    value_innovation: 'Korrigieren statt löschen',
    value_innovation_desc: 'Wenn sich etwas als falsch herausstellt, korrigieren wir den Artikel und schreiben dazu, was sich geändert hat.',
    international_title: 'Aktueller Stand',
    international_text: 'Diese Seite ist im Aufbau. Der Schwerpunkt liegt derzeit auf eSIM-Tarifen für die Türkei; weitere Reiseziele kommen dazu, sobald wir sie in der gleichen Tiefe abdecken können.',
    convinced_title: 'Fragen?',
    convinced_text: 'Schreib uns – zu dieser Seite, zu einem Artikel oder wenn dir ein Fehler auffällt.',
    contact_us: 'Kontakt aufnehmen',
    back_to_home: 'Zurück zur Startseite',
  },
}

export default function AboutUsPage({ params }: { params: Promise<{ lng: string }> }) {
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
        {/* 标题和介绍 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {t('subtitle')}
          </h2>
          <p className="text-xl font-medium text-blue-600 mb-6">
            {t('tagline')}
          </p>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {t('description')}
          </p>
          <p className="text-gray-700 text-lg mb-4 leading-relaxed">
            {t('description2')}
          </p>
          <p className="text-lg font-semibold text-gray-800 mt-6">
            {t('guarantee')}
          </p>
        </section>

        {/* eSIM 特性 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('features_title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_online')}
              </h3>
              <p className="text-gray-600">
                {t('feature_online_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_coverage')}
              </h3>
              <p className="text-gray-600">
                {t('feature_coverage_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('feature_easy')}
              </h3>
              <p className="text-gray-600">
                {t('feature_easy_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 使命和愿景 */}
        <section className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('mission_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('mission_text')}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('vision_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('vision_text')}
            </p>
          </div>
        </section>

        {/* 为什么选择我们 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('why_title')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_no_remove')}
              </h3>
              <p className="text-gray-600">
                {t('why_no_remove_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_various')}
              </h3>
              <p className="text-gray-600">
                {t('why_various_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_digital')}
              </h3>
              <p className="text-gray-600">
                {t('why_digital_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_saving')}
              </h3>
              <p className="text-gray-600">
                {t('why_saving_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('why_support')}
              </h3>
              <p className="text-gray-600">
                {t('why_support_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 核心价值观 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('values_title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_customer')}
              </h3>
              <p className="text-gray-600">
                {t('value_customer_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_reliability')}
              </h3>
              <p className="text-gray-600">
                {t('value_reliability_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_integrity')}
              </h3>
              <p className="text-gray-600">
                {t('value_integrity_desc')}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('value_innovation')}
              </h3>
              <p className="text-gray-600">
                {t('value_innovation_desc')}
              </p>
            </div>
          </div>
        </section>

        {/* 国际 eSIM 提供商 */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('international_title')}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {t('international_text')}
          </p>
        </section>


        {/* 联系我们 */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t('convinced_title')}
          </h2>
          <p className="text-xl mb-6">
            {t('convinced_text')}
          </p>
          <Link
            href={`/${lng}`}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('contact_us')}
          </Link>
        </section>
      </div>
    </main>
  )
}

