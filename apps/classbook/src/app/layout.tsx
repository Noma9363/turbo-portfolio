import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

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
          <header className="h-14 border-b border-border flex items-center px-4">
            <h1 className="text-sm font-semibold">Classbook</h1>
          </header>
          {children}
        </Providers>
      </body>
    </html>
  );
}
