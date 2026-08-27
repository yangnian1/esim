import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "../globals.css";
import { languages } from '../../i18n/settings'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// const inter = Inter({ subsets: ['latin'] })

// 临时使用系统字体来避免网络问题
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// 这是没有自己 metadata 的页面的兜底。原来写的是
// "Buy eSIMs ... for over 200 countries" —— 两处都不实：本站不卖卡（是联盟
// 推荐站），库里也只有土耳其的 14 个产品，谈不上 200 个国家。
export const metadata: Metadata = {
  title: "hello esims – eSIM für die Türkei vergleichen",
  description: "Unabhängiger Vergleich von Reise-eSIMs für die Türkei: Datenvolumen, Laufzeit und Preis im Überblick, dazu Anleitungen zur Einrichtung.",
  icons: {
    icon: '/favicon.ico',
    apple: '/icon.png',
  },
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

/**
 * ⚠️ 这里以前挂着 Google Analytics（衡量 ID 硬编码），2026-08-27 摘掉了。
 *
 * 原因不是它没用，而是在德国 GA 属于需要**事先同意**的第三方 Cookie
 * （TTDSG §25），而本站既没有同意墙也没有 Datenschutzerklärung。
 * 站还没有流量，GA 那个数据流的域名还配错了，数据本来也不准 ——
 * 留着只有风险没有收益。
 *
 * 要重新接统计，两条路：
 * 1. 无 Cookie 的统计（Plausible / Umami）—— 不需要同意墙，直接加即可；
 * 2. 还想用 GA —— **必须先做同意管理**，在用户同意前不得加载脚本。
 *
 * 在那之前，搜索侧的数据看 Google Search Console（服务端数据，不种 Cookie，
 * 不需要同意），出站转化看后台 /analytics 的 affiliate_clicks。
 */
export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    lng: string;
  }>
}>) {
  const { lng } = await params
  return (
    <html lang={lng} dir="ltr">
      <body className="antialiased font-sans">
          <Header lng={lng} />
          <main className="pt-16">{children}</main>
          <Footer lng={lng} />
      </body>
    </html>
  );
}
