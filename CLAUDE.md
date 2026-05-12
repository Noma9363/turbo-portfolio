# turbo-portfolio

## 프로젝트 개요
Turborepo 기반 모노레포 포트폴리오. Next.js 15 + Tailwind CSS v4 + Framer Motion + Shadcn/ui 스타일 컴포넌트로 구성된 다크 미니멀 테마 원페이지 포트폴리오.

## 기술 스택
- **모노레포**: Turborepo + pnpm workspaces
- **앱**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **애니메이션**: Framer Motion v11
- **컴포넌트**: Shadcn/ui 스타일 (자체 구현, Radix UI + CVA 기반)
- **UI 개발**: Storybook 8 (`@storybook/react-vite`)
- **언어**: TypeScript 5
- **패키지 매니저**: pnpm 10

## 프로젝트 구조
```
turbo-portfolio/
├── apps/
│   └── portfolio/                  # Next.js 15 메인 포트폴리오 앱
│       ├── next.config.ts          # transpilePackages: ['@repo/ui']
│       ├── postcss.config.mjs      # @tailwindcss/postcss
│       └── src/
│           ├── app/
│           │   ├── layout.tsx      # 루트 레이아웃, Inter 폰트
│           │   ├── page.tsx        # 원페이지 (/ 경로)
│           │   └── globals.css     # Tailwind v4 + 다크 테마 변수 (@theme)
│           └── components/
│               ├── Navigation.tsx          # 고정 네비게이션 (스크롤 감지)
│               └── sections/
│                   ├── Hero.tsx            # 히어로 섹션 (stagger 애니메이션)
│                   ├── About.tsx           # 소개 + 스킬 배지
│                   ├── Projects.tsx        # 프로젝트 카드 그리드
│                   └── Contact.tsx         # 연락처 + 소셜 링크
├── packages/
│   ├── ui/                         # 공유 컴포넌트 라이브러리
│   │   ├── .storybook/
│   │   │   ├── main.ts             # Storybook 설정 (Vite + @tailwindcss/vite)
│   │   │   └── preview.ts          # 다크 배경, styles.css 임포트
│   │   └── src/
│   │       ├── index.ts            # 공개 exports
│   │       ├── styles.css          # Tailwind v4 + 다크 테마 (Storybook용)
│   │       ├── lib/utils.ts        # cn() 유틸 (clsx + tailwind-merge)
│   │       ├── components/
│   │       │   ├── Button.tsx      # CVA 기반 Button (variant: default/outline/ghost/link/secondary)
│   │       │   ├── Card.tsx        # Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
│   │       │   └── Badge.tsx       # CVA 기반 Badge (variant: default/secondary/outline/muted)
│   │       └── stories/
│   │           └── Button.stories.tsx
│   └── typescript-config/          # 공유 tsconfig
│       ├── base.json
│       └── nextjs.json
├── package.json                    # 루트 (turbo, pnpm workspaces)
├── pnpm-workspace.yaml
└── turbo.json                      # 태스크 파이프라인 (build/dev/lint/storybook)
```

## 패키지 이름
- `@repo/ui` — 공유 UI 컴포넌트
- `@repo/typescript-config` — 공유 TypeScript 설정
- `portfolio` — Next.js 앱

## 주요 명령어
```bash
# 루트에서
pnpm dev              # 전체 개발 서버 (포트폴리오: localhost:3000)
pnpm build            # 전체 빌드
pnpm storybook        # Storybook 실행 (localhost:6006)

# apps/portfolio 에서
pnpm dev              # Next.js 개발 서버 (--turbopack)
pnpm build            # Next.js 빌드

# packages/ui 에서
pnpm storybook        # Storybook 개발 서버
```

## 컬러 테마 (다크 미니멀 - Zinc 기반)
`globals.css` 와 `packages/ui/src/styles.css` 의 `@theme` 블록에서 정의:
- `--color-background`: `#09090b` (zinc-950)
- `--color-foreground`: `#fafafa`
- `--color-card`: `#0f0f11`
- `--color-border`: `#27272a`
- `--color-muted-foreground`: `#71717a`

## 중요 설정 사항
- `apps/portfolio/next.config.ts`: `transpilePackages: ['@repo/ui']` — 모노레포에서 UI 패키지 TypeScript 직접 컴파일
- `globals.css`: `@source "../../../packages/ui/src"` — Tailwind가 packages/ui 클래스도 스캔
- `packages/ui/tsconfig.json`: `include: ["src", ".storybook"]` — .storybook 폴더도 bundler 모듈 해석 적용
- 모든 섹션 컴포넌트는 `"use client"` 선언 (Framer Motion은 클라이언트 전용)

## Framer Motion 패턴
```tsx
// 스크롤 애니메이션 (각 섹션)
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.7, ease: "easeOut" }}
/>

// stagger (Hero, 스킬 배지)
variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
```
