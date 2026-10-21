import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://turbo-portfolio-portfolio.vercel.app"),
  title: "Cho Lee Han | Frontend Developer",
  description: "협업 효율을 고민하는 프론트엔드 개발자",
  openGraph: {
    title: "Cho Lee Han | Frontend Developer",
    description: "협업 효율을 고민하는 프론트엔드 개발자입니다. 함께 일하기 좋은 코드를 추구합니다.",
    url: "/",
    siteName: "Portfolio",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geist.variable} ${notoSansKR.variable}`}>
      <body className="font-[var(--font-geist)] antialiased">{children}</body>
    </html>
  );
}
