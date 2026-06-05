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
  title: "Reviews",
  description: "음향기기 리뷰 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geist.variable} ${notoSansKR.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
