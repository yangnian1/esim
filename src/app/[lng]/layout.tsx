import type { Metadata } from "next";
// import { Inter } from 'next/font/google'
import "../globals.css";
import { languages } from '../../i18n/settings'
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
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

export const metadata: Metadata = {
  title: "hello esims - Global Travel eSIM Solutions",
  description: "Buy eSIMs for your travels worldwide. Stay connected with affordable data plans for over 200 countries.",
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
        <AuthProvider>
          <Header lng={lng} />
          <main className="pt-16">{children}</main>
          <Footer lng={lng} />
        </AuthProvider>
      </body>
    </html>
  );
}
