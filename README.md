# turbo-portfolio

프론트엔드 개발자 포트폴리오. Turborepo 기반 모노레포로 구성되어 있으며,
아래 3개 앱으로 구성됨.

## 앱 구성

### [portfolio](./apps/portfolio) — 메인 포트폴리오
프론트엔드 개발 경험과 프로젝트를 소개하는 원페이지 포트폴리오
**라이브**: https://turbo-portfolio-portfolio.vercel.app/
**기술**: Next.js 15, Tailwind CSS v4, Framer Motion

### [reviews](./apps/reviews) — 음향기기 리뷰 플랫폼
Google OAuth 인증과 Supabase 기반 음향기기 리뷰 플랫폼
**라이브**: https://turbo-portfolio-reviews.vercel.app/reviews
**기술**: Next.js 15, NextAuth v5, Supabase, TanStack Query

### [taski](./apps/taski) — 칸반 일정 관리 앱
드래그앤드롭으로 우선순위를 조정하는 칸반형 일정 관리 앱
**라이브**: https://turbo-portfolio-taski.vercel.app
**기술**: Next.js 15, Zustand, Dnd-kit

## 공통 기술 스택
- Turborepo + pnpm workspaces
- TypeScript 5
- 공유 컴포넌트: `packages/ui` (shadcn/ui 기반)

## 로컬 실행
\`\`\`bash
pnpm install
pnpm dev
\`\`\`
