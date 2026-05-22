"use client";

import { motion } from "framer-motion";
import { Button } from "@repo/ui";
import { Mail, Github, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { Container } from "@/components/Container";
import {SectionLabel} from "@/components/SectionLabel";

const socialLinks = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:noma9363@gmail.com",
    value: "noma9363@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/Noma9363",
    value: "Noma9363",
  },
  {
    icon: Linkedin,
    label: "Linkedin",
    href: "https://www.linkedin.com/in/leehan-cho-78230a308/",
    value: "leehan-cho",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-32">
      <Container>
        <div className="max-w-full">
          {/* 섹션 헤더 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <SectionLabel>
              Contact
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-snug">
              새로운 기회를
              <br />
              <span className="text-muted-foreground">기다리고 있습니다</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              프론트엔드 개발자로서 새로운 팀과 함께할 기회를 찾고 있습니다.
              좋은 사용자 경험을 만드는 일에 관심이 많으며, 함께 성장할 수 있는 환경을 기대합니다.
              채용 문의나 협업 제안은 편하게 연락 주세요.
            </p>
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-16"
          >
            <Button size="lg" asChild>
              <a href="mailto:hello@yourname.dev">
                연락하기
                <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </motion.div>

          {/* 소셜 링크 목록 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.08, delayChildren: 0.2 },
              },
            }}
            className="space-y-1 max-w-fit"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.label !== "Email" ? "_blank" : undefined}
                rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.5, ease: "easeOut" },
                  },
                }}
                className="flex items-center gap-4 p-4 rounded-xl border border-transparent hover:border-border hover:bg-card transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                  <link.icon size={18} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">
                    {link.label}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {link.value}
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* 푸터 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-24 pt-8 border-t border-border"
        >
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Joy Han. Built with Next.js,
            Turborepo & Tailwind CSS.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
