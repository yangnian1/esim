import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "../globals.css";
import { languages } from '../../i18n/settings'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

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
        <GoogleAnalytics />
          <Header lng={lng} />
          <main className="pt-16">{children}</main>
          <Footer lng={lng} />
      </body>
    </html>
  );
}
