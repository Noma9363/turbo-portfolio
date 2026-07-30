import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { HeaderVisibility } from "@/components/layout/HeaderVisibility";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Classbook",
  description: "강의실 예약 플랫폼",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={geist.variable}>
      <body className="antialiased">
        <Providers>
          <HeaderVisibility>
            <Header />
          </HeaderVisibility>
          {children}
        </Providers>
      </body>
    </html>
  );
}
