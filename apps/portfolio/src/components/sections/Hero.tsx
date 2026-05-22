"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { Container } from "@/components/Container";

/*
 * Framer Motion 애니메이션 variant 정의.
 * container: 자식 요소들을 순서대로 등장시키는 stagger 효과
 * item: 각 요소의 등장 애니메이션 (아래→위, 투명→불투명)
 */
const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-start justify-center"
    >
      {/* 배경 그라디언트 (미묘한 글로우 효과) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-zinc-800/20 blur-[120px]" />
      </div>

      <Container className="relative z-10">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="max-w-3xl text-start"
      >
        {/* 서브 레이블 */}
        <motion.div variants={item}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted text-muted-foreground text-xs font-medium tracking-wider uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Ver 0.0.1
          </span>
        </motion.div>

        {/* 메인 헤드라인 */}
        <motion.h1
          variants={item}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-6"
        >
          <span className="bg-gradient-to-br from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent
            scroll-m-20 text-start text-9xl font-extrabold tracking-tight text-balance
          ">
            Hello,
          </span>
          <br />
          <span className="bg-gradient-to-br from-white to-zinc-300 bg-clip-text text-transparent">
            I&apos;m Joy Han
          </span>
        </motion.h1>

        {/* 직함 */}
        <motion.p
          variants={item}
          className="text-xl sm:text-2xl text-muted-foreground font-light mb-6"
        >
          Front End Developer
        </motion.p>

        {/* 설명 */}
        <motion.p
          variants={item}
          className="text-base sm:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
        >
          협업 효율을 고민하는 개발자입니다. 프로젝트 구조 설계부터 코드 컨벤션,<br/>
          디렉토리 관리까지 — 함께 일하기 좋은 코드를 추구합니다.
        </motion.p>

        {/* CTA 버튼 */}
        <motion.div
          variants={item}
          className="flex flex-wrap items-center justify-start gap-3 mb-12"
        >
          <Button size="lg" variant="outline" onClick={scrollToProjects}>
            View Projects
          </Button>
          <Button size="lg" variant="outline" onClick={scrollToContact}>
            Contact Me
          </Button>
        </motion.div>

        {/* 소셜 링크 */}
        <motion.div
          variants={item}
          className="flex items-center justify-start gap-4"
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={20} />
          </a>
        </motion.div>
      </motion.div>
      </Container>

      {/* 스크롤 유도 아이콘 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="text-muted-foreground"
        >
          <ArrowDown size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
}
