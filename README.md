# turbo-portfolio

프론트엔드 개발자 포트폴리오. Turborepo 기반 모노레포로 구성된 다크 미니멀 스타일의 Next.js 앱들입니다.

---

## 앱 목록

| 앱 | 설명 | 라이브 | 로컬 포트 |
|---|---|---|---|
| **portfolio** | 원페이지 포트폴리오 | [turbo-portfolio-portfolio.vercel.app](https://turbo-portfolio-portfolio.vercel.app/) | 3000 |
| **taski** | 칸반 + 체크리스트 일정 관리 앱 | [turbo-portfolio-taski.vercel.app](https://turbo-portfolio-taski.vercel.app) | 3001 |
| **reviews** | 음향기기 리뷰 플랫폼 (Google OAuth + Supabase) | [turbo-portfolio-reviews.vercel.app](https://turbo-portfolio-reviews.vercel.app/reviews) | 3002 |

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router), React 19 |
| 스타일링 | Tailwind CSS v4 |
| 애니메이션 | Framer Motion v11 |
| 컴포넌트 | Radix UI + CVA (Shadcn/ui 스타일) |
| 인증 | NextAuth v5 + Google OAuth |
| DB | Supabase (PostgreSQL) |
| 서버 상태 | TanStack Query v5 |
| 모노레포 | Turborepo + pnpm workspaces |
| 언어 | TypeScript 5 |
| 배포 | Vercel |

---

## 구현 포인트

**모노레포 구조**
- `packages/ui` — Button, Card, Badge 등 공유 컴포넌트 라이브러리 (shadcn/ui 스타일, Radix UI + CVA)
- 앱마다 `globals.css @theme`에서 색상/폰트 토큰을 독립 관리해 멀티 앱 테마 전략 지원

**portfolio**
- Framer Motion `whileInView` + `staggerChildren`으로 섹션 진입 시 순차 등장
- Navigation: 모바일 풀너비 바 / 데스크탑 중앙 pill (backdrop blur)

**taski**
- Zustand persist로 새로고침해도 상태 유지
- `@dnd-kit`으로 칸반 드래그 앤 드롭 + 모바일 TouchSensor 지원
- 체크리스트 / 칸반 뷰 전환

**reviews**
- NextAuth v5 Google OAuth 로그인
- Supabase PostgreSQL + Server Actions CRUD
- URL searchParams 기반 카테고리 필터 + `<Suspense>` 스트리밍

---

## 로컬 실행

```bash
# 의존성 설치
pnpm install

# 전체 개발 서버 (각 앱이 3000/3001/3002 포트로 실행)
pnpm dev

# 빌드
pnpm build
```

> pnpm 10, Node.js 18+ 필요
>
> reviews 앱은 Supabase + Google OAuth 환경변수 필요 (`apps/reviews/.env.local`)

---

## 프로젝트 구조

```
turbo-portfolio/
├── apps/
│   ├── portfolio/   # 원페이지 포트폴리오 (Framer Motion 스크롤 애니메이션)
│   ├── taski/       # 일정 관리 앱 (Zustand + dnd-kit 칸반)
│   └── reviews/     # 리뷰 플랫폼 (NextAuth + Supabase + TanStack Query)
└── packages/
    ├── ui/          # 공유 컴포넌트 라이브러리 (Button, Card, Badge 등)
    └── typescript-config/  # 공유 tsconfig
```
