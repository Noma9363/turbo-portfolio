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
  title: "Portfolio",
  description: "Front-end Developer Portfolio",
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
