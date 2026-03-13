import Link from 'next/link'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getTurkeyPlans } from '@/lib/blog'
import { formatPrice } from '@/lib/mock-data'

// ─── SEO metadata ────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'eSIM Türkei 2026: Die besten Tarife für 7–30 Tage',
  description:
    'Vergleiche eSIM-Tarife für die Türkei, finde den passenden Plan für 7, 10 oder 15–30 Tage und gehe direkt nach der Landung online.',
}

// ─── FAQ 数据 ─────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Funktioniert eSIM in der Türkei?',
    a: 'Ja, mit einer Reise-eSIM kannst du in der Türkei mobile Daten nutzen, sofern dein Gerät eSIM unterstützt und entsperrt ist.',
  },
  {
    q: 'Kann ich mit einer Türkei-eSIM telefonieren?',
    a: 'Die meisten Reise-eSIMs sind Datentarife. Telefonieren funktioniert meist über WhatsApp, FaceTime oder andere Apps.',
  },
  {
    q: 'Wann sollte ich die eSIM installieren?',
    a: 'Am besten vor der Abreise, solange du stabiles WLAN hast und den QR-Code sicher speichern kannst.',
  },
]

// FAQ JSON-LD 结构化数据
function FaqJsonLd() {
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
}

// ─── Tarife 表格（动态获取产品） ──────────────────────────────────────────────
async function TarifTable() {
  const { data: products } = await getTurkeyPlans('de', 12)

  if (!products || products.length === 0) {
    return (
      <p className="text-center text-gray-500 py-6">
        Aktuell sind keine Tarife verfügbar. Bitte schaue später noch einmal vorbei.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="py-3 px-4 text-sm font-semibold text-gray-700">Tarif</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700">Gültigkeit</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700">Preis</th>
            <th className="py-3 px-4 text-sm font-semibold text-gray-700">Aktion</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="py-3 px-4 text-sm text-gray-900 font-medium">{p.name}</td>
              <td className="py-3 px-4 text-sm text-gray-600">
                {p.validity_days ? `${p.validity_days} Tage` : '–'}
              </td>
              <td className="py-3 px-4 text-sm font-semibold text-blue-600">
                {formatPrice(p.price, 'USD')}
              </td>
              <td className="py-3 px-4">
                <Link
                  href="/de/products?country=Turkey"
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors"
                >
                  Jetzt kaufen →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TarifTableLoading() {
  return (
    <div className="animate-pulse space-y-3 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 bg-gray-200 rounded" />
      ))}
    </div>
  )
}

// ─── 推荐卡片 ─────────────────────────────────────────────────────────────────
const recommendations = [
  {
    title: 'Kurztrip (3–7 Tage)',
    desc: 'Für Maps, WhatsApp und alltägliche Nutzung reichen oft 1–5 GB.',
    rec: '7 Tage / 3–5 GB',
    cta: 'Empfehlung ansehen',
  },
  {
    title: 'Klassischer Urlaub (7–10 Tage)',
    desc: 'Für Social Media, Fotos und Navigation sind 5–10 GB für die meisten Reisenden die beste Wahl.',
    rec: '7–15 Tage / 5–10 GB',
    cta: 'Passenden Tarif finden',
  },
  {
    title: 'Längere Reise / Hotspot / Remote Work',
    desc: 'Wenn du dein Internet teilst oder mit Laptop arbeitest, solltest du 10–20 GB oder mehr wählen.',
    rec: '15–30 Tage / 10–20 GB',
    cta: 'Mehr Daten ansehen',
  },
]

// ─── 激活步骤 ──────────────────────────────────────────────────────────────────
const activationSteps = [
  {
    title: 'Vor der Reise',
    items: [
      'Prüfe, ob dein Gerät eSIM unterstützt',
      'Speichere QR-Code oder Aktivierungscode',
      'Installiere die eSIM möglichst vor dem Abflug',
    ],
  },
  {
    title: 'Bei Ankunft',
    items: [
      'Wähle die eSIM als Daten-SIM',
      'Aktiviere mobile Daten',
      'Falls nötig: Datenroaming für die eSIM einschalten',
    ],
  },
]

// ─── 主页面 ───────────────────────────────────────────────────────────────────
export default function EsimTuerkeiPage() {
  return (
    <>
      <FaqJsonLd />

      <main className="min-h-screen bg-gray-50">
        {/* ── Hero / Header ───────────────────────────────────── */}
        <section className="bg-gradient-to-b from-purple-50 to-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* 面包屑 */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <Link href="/de" className="hover:text-purple-600 transition-colors">
                Startseite
              </Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">eSIM Türkei</span>
            </nav>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              eSIM Türkei 2026: Die besten Tarife für 7–30&nbsp;Tage
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl">
              Vergleiche eSIM-Tarife für die Türkei, finde den passenden Plan für 7, 10 oder
              15–30&nbsp;Tage und gehe direkt nach der Landung online.
            </p>

            <Link
              href="#tarife"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-medium shadow hover:bg-purple-700 transition-colors"
            >
              Jetzt Türkei-Tarife ansehen ↓
            </Link>

            <ul className="mt-8 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-purple-500">✓</span>
                Sofort per QR-Code installierbar
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-purple-500">✓</span>
                Kein physischer SIM-Kartenwechsel nötig
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-purple-500">✓</span>
                Ideal für Urlaub, Istanbul und Rundreisen
              </li>
            </ul>
          </div>
        </section>

        {/* ── Empfehlungen ────────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Unsere Empfehlungen für 7, 10 und 15–30&nbsp;Tage
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((r) => (
                <article
                  key={r.title}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{r.title}</h3>
                  <p className="text-sm text-gray-600 flex-grow">{r.desc}</p>
                  <p className="mt-4 text-sm font-medium text-purple-700">
                    Empfehlung: {r.rec}
                  </p>
                  <Link
                    href="#tarife"
                    className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-purple-400 hover:text-purple-700 transition-colors"
                  >
                    {r.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tarife im Vergleich ─────────────────────────────── */}
        <section id="tarife" className="py-12 md:py-16 bg-white scroll-mt-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              eSIM Türkei Tarife im Vergleich
            </h2>

            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <Suspense fallback={<TarifTableLoading />}>
                <TarifTable />
              </Suspense>
            </div>
          </div>
        </section>

        {/* ── Wie viel Daten? ─────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Wie viel Daten brauche ich in der Türkei?
            </h2>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
              <p className="text-gray-700">
                <strong className="text-gray-900">1–3 GB pro Woche:</strong> wenn du hauptsächlich
                Maps, Messenger und E-Mail nutzt.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">5–10 GB pro Woche:</strong> wenn du zusätzlich
                Social Media, Fotos und kurze Videos nutzt.
              </p>
              <p className="text-gray-700">
                <strong className="text-gray-900">10–20 GB oder mehr:</strong> wenn du Hotspot,
                Streaming oder Remote Work planst.
              </p>
            </div>
          </div>
        </section>

        {/* ── Aktivierungsanleitung ───────────────────────────── */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              So aktivierst du deine Türkei-eSIM auf iPhone und Android
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activationSteps.map((step) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{step.title}</h3>
                  <ul className="space-y-2">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-0.5 text-purple-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-6 text-sm text-gray-600">
              Mehr dazu in unseren Anleitungen:{' '}
              <Link
                href="/de/blog/esim-tuerkei-aktivieren/"
                className="text-purple-600 hover:text-purple-800 underline transition-colors"
              >
                eSIM Türkei aktivieren
              </Link>
            </p>
          </div>
        </section>

        {/* ── Warnung (gesperrt) ──────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              eSIM Türkei gesperrt? Das solltest du vor der Reise wissen
            </h2>

            <div className="rounded-xl border-l-4 border-amber-400 bg-amber-50 p-6">
              <p className="text-gray-800">
                Wenn du auf Nummer sicher gehen willst, kaufe und installiere deine eSIM vor dem
                Abflug, speichere den QR-Code offline und notiere dir den Support-Kontakt des
                Anbieters.
              </p>
              <p className="mt-3">
                <Link
                  href="/de/blog/esim-tuerkei-gesperrt/"
                  className="text-amber-800 hover:text-amber-900 font-medium underline transition-colors"
                >
                  Mehr zum Thema „gesperrt?" lesen →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────── */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Häufige Fragen zur eSIM für die Türkei
            </h2>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 px-6 py-4"
                >
                  <summary className="cursor-pointer text-base font-semibold text-gray-900 marker:text-purple-500 group-open:mb-3">
                    {faq.q}
                  </summary>
                  <p className="text-sm text-gray-700 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ──────────────────────────────────────── */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Jetzt den passenden Tarif auswählen
            </h2>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              Wähle jetzt den Tarif, der zu deiner Reisedauer und deinem Datenbedarf passt.
            </p>
            <Link
              href="/de/products?country=Turkey"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 text-white font-medium shadow hover:bg-purple-700 transition-colors"
            >
              Zu den eSIM-Angeboten für die Türkei →
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}

