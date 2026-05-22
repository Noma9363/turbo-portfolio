# turbo-portfolio

## 프로젝트 개요
Turborepo 기반 모노레포 포트폴리오. Next.js 15 + Tailwind CSS v4 + Framer Motion + Shadcn/ui 스타일 컴포넌트로 구성된 다크 미니멀 테마 원페이지 포트폴리오.

## 기술 스택
- **모노레포**: Turborepo + pnpm workspaces
- **앱**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **애니메이션**: Framer Motion v11
- **컴포넌트**: Shadcn/ui 스타일 (Radix UI + CVA 기반)
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
│           │   ├── layout.tsx      # 루트 레이아웃, Geist + Noto Sans KR 폰트
│           │   ├── page.tsx        # 원페이지 (/ 경로)
│           │   └── globals.css     # Tailwind v4 + 다크 테마 변수 (@theme) + @utility
│           └── components/
│               ├── Navigation.tsx          # 고정 네비게이션 (모바일: 풀너비 / 데스크탑: 중앙 pill)
│               ├── Container.tsx           # 최대 너비(1276px) 레이아웃 래퍼
│               ├── SectionLabel.tsx        # 섹션 상단 라벨 (uppercase, border-b)
│               └── sections/
│                   ├── Hero.tsx            # 히어로 섹션 (stagger 애니메이션)
│                   ├── About.tsx           # 소개 + 스킬 배지 (한국어 컨텐츠, max-w-prose)
│                   ├── Projects.tsx        # 프로젝트 카드 그리드
│                   └── Contact.tsx         # 연락처 + 소셜 링크 (한국어, 실제 연락처)
├── packages/
│   ├── ui/                         # 공유 컴포넌트 라이브러리
│   │   ├── components.json         # shadcn CLI 설정
│   │   ├── .storybook/
│   │   │   ├── main.ts             # Storybook 설정 (Vite + @tailwindcss/vite)
│   │   │   └── preview.ts          # 다크 배경, styles.css 임포트
│   │   └── src/
│   │       ├── index.ts            # 공개 exports
│   │       ├── styles.css          # Tailwind v4 + 다크 테마 (Storybook용)
│   │       ├── lib/utils.ts        # cn() 유틸 (clsx + tailwind-merge)
│   │       └── components/
│   │           ├── ui/             # shadcn 원본 컴포넌트 (모든 앱 공통 단일 컴포넌트)
│   │           │   ├── Button.tsx  # CVA 기반 Button (variant: default/outline/ghost/link/secondary)
│   │           │   ├── Card.tsx    # Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
│   │           │   └── Badge.tsx   # CVA 기반 Badge (variant: default/secondary/outline/muted)
│   │           └── blocks/         # 복합 컴포넌트 (ui 조합, 여러 앱 공유)
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

## 컴포넌트 관리 원칙
- `packages/ui/src/components/ui/` — shadcn 원본 + 최소 커스텀, 모든 앱 공통 단일 컴포넌트
- `packages/ui/src/components/blocks/` — 여러 ui 컴포넌트를 조합한 복합 컴포넌트, 여러 앱 공유
- `apps/portfolio/src/components/` — portfolio 앱 전용 컴포넌트 (다른 앱에서 쓰지 않는 것)
- shadcn 컴포넌트 추가: `packages/ui` 에서 `pnpm dlx shadcn@latest add <component>`

## 폰트
- **영문**: Geist (`--font-geist`)
- **한글**: Noto Sans KR (`--font-noto-sans-kr`, 자동 폴백)
- `body`: `font-family: var(--font-geist), var(--font-noto-sans-kr), sans-serif`

## 커스텀 타이포그래피 유틸리티
`apps/portfolio/src/app/globals.css` 의 `@utility` 블록에서 정의:
- `font-heading-extra` — Geist 800, tracking -0.02em, line-height 1
- 새 유틸리티 추가 시 `@utility` 사용 (`@theme` 은 CSS 변수/토큰 전용)
- 레이아웃/정렬 클래스(`text-left`, `scroll-m-20`, `text-9xl`)는 유틸리티에 포함하지 않음

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
pnpm dlx shadcn@latest add <component>   # shadcn 컴포넌트 추가
```

## 컬러 테마 (다크 미니멀 - Zinc 기반)
`globals.css` 와 `packages/ui/src/styles.css` 의 `@theme` 블록에서 정의:
- `--color-background`: `#09090b` (zinc-950)
- `--color-foreground`: `#fafafa`
- `--color-card`: `#0f0f11`
- `--color-border`: `#27272a`
- `--color-muted-foreground`: `#71717a`

## 멀티 앱 테마 전략
- 컴포넌트 로직은 `packages/ui` 에서 공유
- 테마(색상, 폰트, radius)는 각 앱의 `globals.css` `@theme` 에서 독립 관리
- 새 앱 추가 시: `@repo/ui` 의존성 추가 후 `globals.css` 에 `@theme` 변수만 재정의

## 배포
- **플랫폼**: Vercel
- **Production URL**: https://turbo-portfolio-portfolio.vercel.app/
- **Production 브랜치**: `main` — PR 머지 시 자동 배포

## 브랜치 전략
```
main  ← develop PR 머지로 배포 (v1 완료)
└── develop
    ├── feat/ui-restructure   # packages/ui 구조, 공통 설정 (머지 완료)
    ├── feat/hero             # Hero 섹션 + Container 컴포넌트 (머지 완료)
    ├── feat/about            # About 섹션 + SectionLabel 컴포넌트 (머지 완료)
    ├── feat/projects         # Projects 섹션 (머지 완료)
    ├── feat/contact          # Contact 섹션 한국어 현지화 (머지 완료)
    └── feat/<next>           # 다음 작업 브랜치
```
- `packages/ui` 변경은 `feat/ui-*` 브랜치에서 작업
- 각 섹션 작업은 `develop` 에서 분기한 `feat/<section>` 브랜치에서 작업
- 완료 후 `develop` 으로 머지 → 검증 후 `main` 으로 PR → Vercel 자동 배포

## Navigation 구조
- **모바일** (`md` 미만): 풀 너비 상단 바, 로고 + 링크, 스크롤 시 배경 생김
- **데스크탑/태블릿** (`md` 이상): `fixed top-4 left-1/2 -translate-x-1/2` 중앙 pill, 항상 backdrop blur

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
