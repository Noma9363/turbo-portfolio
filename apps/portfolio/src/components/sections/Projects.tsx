"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@repo/ui";
import { Github, ExternalLink } from "lucide-react";
import { Container } from "@/components/Container";
import {SectionLabel} from "@/components/SectionLabel";

const projects = [
  {
    title: "Project Alpha",
    description:
      "A modern SaaS platform with real-time collaboration features. Built for teams to manage workflows and communicate efficiently.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
  },
  {
    title: "Project Beta",
    description:
      "Open source CLI tool for automating development workflows. Reduces repetitive setup tasks and enforces team conventions.",
    tags: ["Node.js", "TypeScript", "Commander", "Inquirer"],
    github: "https://github.com",
    live: null,
    featured: false,
  },
  {
    title: "Project Gamma",
    description:
      "E-commerce platform with advanced filtering, search, and a seamless checkout flow powered by Stripe.",
    tags: ["Next.js", "Algolia", "Stripe", "Zustand"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
  },
  {
    title: "Project Delta",
    description:
      "A personal finance dashboard that aggregates data from multiple sources and visualizes spending patterns.",
    tags: ["React", "D3.js", "Express", "MongoDB"],
    github: "https://github.com",
    live: "https://example.com",
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
