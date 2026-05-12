import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

/*
 * next/font/google: Google Fonts를 자동으로 최적화해서 로드.
 * 빌드 시 폰트 파일을 직접 다운로드하므로 외부 요청 없이 빠르게 로드됨.
 */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Full Stack Developer Portfolio",
};

/*
 * RootLayout: Next.js App Router의 최상위 레이아웃.
 * 모든 페이지를 감싸는 공통 HTML 구조를 정의.
 * children = 각 페이지 컴포넌트
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="font-[var(--font-inter)] antialiased">{children}</body>
    </html>
  );
}
