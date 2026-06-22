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
│   ├── portfolio/                  # Next.js 15 메인 포트폴리오 앱
│   │   ├── next.config.ts          # transpilePackages: ['@repo/ui']
│   │   ├── postcss.config.mjs      # @tailwindcss/postcss
│   │   └── src/
│   │       ├── app/
│   │       │   ├── layout.tsx      # 루트 레이아웃, Geist + Noto Sans KR 폰트
│   │       │   ├── page.tsx        # 원페이지 (/ 경로)
│   │       │   └── globals.css     # Tailwind v4 + 다크 테마 변수 (@theme) + @utility
│   │       └── components/
│   │           ├── Navigation.tsx          # 고정 네비게이션 (모바일: 풀너비 / 데스크탑: 중앙 pill)
│   │           ├── Container.tsx           # 최대 너비(1276px) 레이아웃 래퍼
│   │           ├── SectionLabel.tsx        # 섹션 상단 라벨 (uppercase, border-b)
│   │           └── sections/
│   │               ├── Hero.tsx            # 히어로 섹션 (stagger 애니메이션)
│   │               ├── About.tsx           # 소개 + 스킬 배지 (한국어 컨텐츠, max-w-prose)
│   │               ├── Projects.tsx        # 프로젝트 카드 그리드
│   │               └── Contact.tsx         # 연락처 + 소셜 링크 (한국어, 실제 연락처)
│   └── taski/                      # 일정 관리 앱 (localhost:3001)
│       ├── next.config.ts          # transpilePackages: ['@repo/ui']
│       ├── postcss.config.mjs
│       └── src/
│           ├── app/
│           │   ├── layout.tsx
│           │   ├── page.tsx        # Sidebar + TodoList + InputBar
│           │   └── globals.css
│           ├── components/         # 체크리스트/섹션/칸반 뷰, DnD, 모달 등
│           └── store/
│               └── taskStore.ts    # Zustand (persist, version: 3)
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
- `portfolio` — Next.js 포트폴리오 앱 (localhost:3000)
- `taski` — 일정 관리 앱 (localhost:3001) → 상세 문서: `apps/taski/CLAUDE.md`

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
main  ← develop PR 머지로 배포
└── develop
    ├── feat/ui-restructure       # packages/ui 구조, 공통 설정 (머지 완료)
    ├── feat/hero                 # Hero 섹션 + Container 컴포넌트 (머지 완료)
    ├── feat/about                # About 섹션 + SectionLabel 컴포넌트 (머지 완료)
    ├── feat/projects             # Projects 섹션 (머지 완료)
    ├── feat/contact              # Contact 섹션 한국어 현지화 (머지 완료)
    ├── feat/taski-kanban         # taski 칸반 보드 (머지 완료)
    ├── feat/taski-responsive     # taski 반응형 + DnD TouchSensor (머지 완료)
    └── feat/<next>               # 다음 작업 브랜치
```
- `packages/ui` 변경은 `feat/ui-*` 브랜치에서 작업
- 각 앱/섹션 작업은 `develop` 에서 분기한 `feat/<name>` 브랜치에서 작업
- 완료 후 `develop` 으로 머지 → 검증 후 `main` 으로 PR → Vercel 자동 배포

## Navigation 구조
- **모바일** (`md` 미만): 풀 너비 상단 바, 로고 + 링크, 스크롤 시 배경 생김
- **데스크탑/태블릿** (`md` 이상): `fixed top-4 left-1/2 -translate-x-1/2` 중앙 pill, 항상 backdrop blur

## 중요 설정 사항
- `apps/portfolio/next.config.ts`: `transpilePackages: ['@repo/ui']` — 모노레포에서 UI 패키지 TypeScript 직접 컴파일
- `globals.css`: `@source "../../../packages/ui/src"` — Tailwind가 packages/ui 클래스도 스캔
- `packages/ui/tsconfig.json`: `include: ["src", ".storybook"]` — .storybook 폴더도 bundler 모듈 해석 적용
- 모든 섹션 컴포넌트는 `"use client"` 선언 (Framer Motion은 클라이언트 전용)

## 트러블슈팅 — Tailwind 클래스 미적용
**증상**: `@repo/ui` 컴포넌트에 적용한 Tailwind 클래스(애니메이션, 색상 등)가 앱에서 무시됨

**원인**: `globals.css`의 `@source` 경로가 잘못되면 Tailwind v4가 `packages/ui/src` 파일을 스캔하지 못해 해당 클래스를 purge(제거)함

**해결**: 각 앱의 `globals.css` 최상단 `@source` 경로가 `packages/ui/src`를 정확히 가리켜야 함
- `apps/portfolio`: `@source "../../../packages/ui/src"`
- `apps/taski`: `@source "../../../packages/ui/src"`
- `apps/reviews`: `@source "../../../packages/ui/src"` (glob 패턴 `**/*.{ts,tsx}` 붙이면 오히려 오동작)

**주의**: glob 패턴 없이 디렉토리 경로만 지정하는 것이 Tailwind v4에서 올바른 방식

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

---

## Phase 3 — reviews 앱 (진행 중)

### 개요
- **브랜치**: `feat/audioreview`
- **앱 경로**: `apps/reviews/` (localhost:3002)
- **마감**: 2026-06-14 (일) — 일정 조정 (목/금 작업 지연)
- **브랜드**: 젠하이저(Sennheiser) 음향기기 리뷰 플랫폼

### 기술 스택
| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 인증 | NextAuth v5 + Google OAuth |
| DB | Supabase (PostgreSQL) |
| 서버 상태 | TanStack Query v5 |
| 스타일 | Tailwind CSS v4 |

### 진행 현황
- [x] 앱 스캐폴딩 + @repo/ui 연동
- [x] Supabase 프로젝트 생성 및 클라이언트 연동
- [x] NextAuth v5 Google OAuth 로그인 구현
- [x] TanStack Query + SessionProvider 설정
- [x] Supabase 테이블 생성 + seed 데이터 (users, products, reviews, likes)
- [x] queries/products.ts + queries/reviews.ts + types/database.ts
- [x] reviews/page.tsx — searchParams 구조 + 목록 렌더링
- [x] ProductCard 컴포넌트 + URL 쿼리 필터 + 스타일링
- [x] 리뷰 create — Server Action + ReviewForm + ReviewFormDialog
- [x] 리뷰 delete — deleteReview + deleteReviewAction + ReviewCard + DeleteConfirmDialog
- [x] ReviewCard 스타일링 + 빈 상태 처리 (6/19)
- [x] Vercel 배포 (6/19) — turbo.json env 선언, auth.ts 타입 오류 수정
- [ ] 버그 수정 — 카테고리 필터 미동작 (모든 상품 노출)
- [ ] 버그 수정 — 비로그인 시 리뷰 모달 오픈 (로그인 페이지 redirect 필요)
- [ ] 반응형 스타일 마무리
- [ ] NEXTAUTH_URL Vercel 환경변수 등록 (배포 URL 확정 후)

### 일정 (재조정 — 마감 6/20 금요일)
| 날짜 | 작업 |
|------|------|
| 월 6/8 | ✅ Supabase + Google OAuth 구축 |
| 화~목 6/9~11 | ✅ 테이블 + 쿼리 + 타입 |
| 금~월 6/12~16 | ✅ ProductCard + FilterBar + ReviewForm + ReviewFormDialog + delete |
| 화 6/17 | ✅ ReviewCard 스타일링 + 빈 상태 처리 |
| 수~목 6/18~19 | ✅ Vercel 배포 |
| 금 6/20 | 버그 수정 (필터, 비로그인 redirect) + 반응형 마무리 |

### 디렉토리 원칙 (taski 반성)
- 기능 단위 폴더 분리: `components/product/`, `components/review/`, `components/auth/`
- 훅은 `hooks/`에 모아서 관리 (`useReviews.ts`, `useFilter.ts`)
- Supabase 쿼리 함수는 `queries/`에 분리 (컴포넌트에 직접 쓰지 않음)

### 반응형 브레이크포인트
- **시작**: 모바일(default) → `md`(768px) → `lg`(1024px) 순서
- 모바일: 1열, 풀너비 필터 드로어
- md: 2열 그리드, 사이드 필터
- lg: 3열 그리드

### 주의사항
- `src/auth.ts` 루트 파일이 NextAuth v5 핵심 — 삭제 금지
- `.env.local`은 gitignore — 다른 기기에서 새로 만들어야 함
- 다른 기기(Windows) 세팅 시 필요한 환경변수:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  NEXTAUTH_URL=http://localhost:3002
  NEXTAUTH_SECRET
  GOOGLE_CLIENT_ID
  GOOGLE_CLIENT_SECRET
  ```
- turbopack.root 설정 필수 (모노레포 워크스페이스 감지 오류 방지)
- 블랙박스 방지: 작은 단위로 요청 (파일 하나씩, 타입 먼저 확정 후 구현)

---

## AI 협업 원칙 (전체 프로젝트 공통)

이 레포의 모든 앱은 프론트엔드 엔지니어링 포트폴리오다.
코드의 모든 결정을 내가 설명할 수 있어야 한다.

### 하지 말 것
- 요청 없이 완성된 코드를 먼저 제시하지 말 것
- 파일 전체를 한 번에 작성해서 주지 말 것
- 내가 방향을 말하기 전에 구현을 제안하지 말 것

### 반드시 할 것
- 내가 "만들어줘"라고 하면 "어떻게 만들려고 해?"라고 먼저 물을 것
- 내 설계를 들은 뒤, 틀렸거나 놓친 부분만 지적할 것
- 막혀서 힌트를 요청하면 코드 대신 방향과 키워드만 줄 것
- 내 코드에 문제가 있으면 고쳐주지 말고 무엇이 왜 문제인지만 설명할 것
- 라이브러리·패턴 선택 시 "왜 이걸 쓰려고 해?"를 먼저 물을 것
