"use client";

/*
 * "use client": 이 파일은 클라이언트(브라우저)에서 실행됨을 선언.
 * useState, useEffect 같은 React 훅을 사용하려면 반드시 필요.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Hero", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  //
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // 현재 보이는 섹션 감지
      const sections = navItems.map((item) => item.href.slice(1));
      for (const section of sections.reverse()) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: 풀 너비 상단 바 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:hidden ${
          scrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="px-6 h-16 flex items-center justify-between">
          <motion.a
            href="#hero"
            onClick={(e) => handleNavClick(e, "#hero")}
            className="text-lg font-bold tracking-tight text-foreground hover:text-muted-foreground transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            Cho Lee Han
          </motion.a>

          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeSection === item.href.slice(1)
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <AnimatePresence>
                    {activeSection === item.href.slice(1) && (
                      <motion.span
                        layoutId="nav-indicator-mobile"
                        className="absolute inset-0 bg-muted rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                  <span className="relative z-10">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </motion.header>

      {/* Desktop/Tablet: 중앙 pill 네비게이션 */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block w-fit"
      >
        <nav className="flex items-center gap-1 px-3 py-2 rounded-full border border-ring ring-offset-neutral-600 ring-offset-1 bg-background/80 backdrop-blur-md">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className={`relative px-4 py-1.5 text-sm rounded-full transition-colors ${
                activeSection === item.href.slice(1)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AnimatePresence>
                {activeSection === item.href.slice(1) && (
                  <motion.span
                    layoutId="nav-indicator-desktop"
                    className="absolute inset-0 bg-muted rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </nav>
      </motion.header>
    </>
  );
}
