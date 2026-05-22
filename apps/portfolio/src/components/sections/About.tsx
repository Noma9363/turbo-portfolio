"use client";

import { motion } from "framer-motion";
import { Badge } from "@repo/ui";
import { Container } from "@/components/Container";
import {SectionLabel} from "@/components/SectionLabel";

const skills = [
  "TypeScript",
  "JavaScript",
  "React",
  "Next.js",
  "TailwindCSS",
  "Shadcn/ui",
  "Turborepo"

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
            <SectionLabel>
              About Me
            </SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-snug mb-6">
              아이디어를 코드로,
              <br />
              <span className="text-muted-foreground">코드를 시스템으로</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                React · Next.js로 웹 서비스를 만들고 있습니다.
                컴포넌트를 설계할 때 재사용성과 확장성을 먼저 고민하고,
                모노레포 환경에서 공유 UI 라이브러리를 직접 구성한 경험이 있습니다.
              </p>
              <p>
                단순히 동작하는 것보다, 다음에도 쓸 수 있는 것을 만드는 것을 중요하게 생각합니다.
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
            <SectionLabel>
              Tech Stack
            </SectionLabel>
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

          </motion.div>
        </div>
      </Container>
    </section>
  );
}
