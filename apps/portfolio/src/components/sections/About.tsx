"use client";

import { motion } from "framer-motion";
import { Badge } from "@repo/ui";
import { Container } from "@/components/Container";

const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "TailwindCSS",
  "Docker",
  "Git",
  "REST API",
  "GraphQL",
  "AWS",
];

/*
 * whileInView: 요소가 뷰포트에 들어올 때 애니메이션 실행
 * viewport={{ once: true }}: 한 번만 실행 (스크롤 올려도 재실행 안 함)
 * viewport={{ margin: "-100px" }}: 100px 여유를 두고 감지
 */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export function About() {
  return (
    <section id="about" className="py-32">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* 텍스트 영역 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
              About Me
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Turning ideas into
              <br />
              <span className="text-muted-foreground">digital reality</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I&apos;m a passionate full-stack developer with a love for
                building clean, accessible web applications. I care deeply about
                user experience and the details that make software feel
                polished.
              </p>
              <p>
                When I&apos;m not coding, I enjoy exploring new technologies,
                contributing to open source, and sharing what I learn with the
                community.
              </p>
            </div>
          </motion.div>

          {/* 스킬 영역 */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4">
              Tech Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  variants={{
                    hidden: { opacity: 0, scale: 0.8 },
                    visible: {
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.4, ease: "easeOut" },
                    },
                  }}
                >
                  <Badge variant="outline" className="text-sm py-1 px-3">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* 간단한 통계 */}
            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { value: "3+", label: "Years Experience" },
                { value: "20+", label: "Projects Built" },
                { value: "10+", label: "Happy Clients" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={fadeUp}
                  className="p-4 rounded-xl border border-border bg-card text-center"
                >
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
