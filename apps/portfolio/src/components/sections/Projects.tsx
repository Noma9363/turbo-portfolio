"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@repo/ui";
import { Github, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import {SectionLabel} from "@/components/SectionLabel";

const projects = [
  {
    title: "TASKI TODO",
    description:
      "카테고리별로 흩어진 할 일을 하나의 앱에서 관리하기 위해 만든 스케줄러.\n" +
        "Todo · Section · Kanban 세 가지 뷰를 지원합니다.",
    tags: ["Next.js", "TypeScript", "Tailwind", "DnD-Kit", "Zustand", "Framer Motion"],
    github: "https://github.com/Noma9363/turbo-portfolio/tree/main/apps/taski",
    live: "https://turbo-portfolio-taski.vercel.app",
    featured: true,
  },
  {
    title: "AUDIO REVIEW",
    description:
      "Supabase(PostgreSQL)와 Google OAuth를 활용한 음향기기 리뷰 플랫폼.\n" +
        "로그인, 리뷰 작성·삭제, 카테고리 필터링을 지원합니다.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase", "NextAuth", "TanStack Query"],
    github: "https://github.com/Noma9363/turbo-portfolio/tree/main/apps/reviews",
    live: "https://turbo-portfolio-reviews.vercel.app/reviews",
    featured: false,
  },
  {
    title: "CLASSBOOK",
    description:
      "카카오맵 SDK와 달력 연동으로 강의실을 예약하는 플랫폼.\n" +
        "예약 충돌 방지, 슬롯 가용성 계산, 찜 기능을 지원합니다.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase", "NextAuth", "KakaoMap"],
    github: "https://github.com/Noma9363/turbo-portfolio/tree/main/apps/classbook",
    live: "https://turbo-portfolio-classbook.vercel.app",
    featured: false,
  },
];

export function Projects() {
  return (
    <section id="projects" className="py-32 bg-muted/10">
      <Container>
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16"
        >
          <SectionLabel>
            Work
          </SectionLabel>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            핵심 프로젝트
          </h2>
        </motion.div>

        {/* 프로젝트 그리드 */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" },
                },
              }}
            >
              <Card className="h-full group hover:border-zinc-600 transition-colors duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg mb-1">
                        {project.title}
                      </CardTitle>
                      {project.featured && (
                        <Badge variant="secondary" className="text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                    {/* 링크 아이콘 */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Github size={16} />
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {project.description}
                  </CardDescription>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="muted" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* 더보기 버튼 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" asChild>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} className="mr-2" />
              View All on GitHub
            </a>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
