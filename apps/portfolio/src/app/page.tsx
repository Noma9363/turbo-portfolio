/*
 * Next.js App Router에서 app/page.tsx = "/" 경로.
 * 기본적으로 Server Component (서버에서 렌더링).
 * 각 섹션 컴포넌트는 "use client"로 클라이언트에서 처리.
 */
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
