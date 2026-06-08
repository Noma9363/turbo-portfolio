# reviews

## 앱 개요
Turborepo 모노레포(`turbo-portfolio`) 내 `apps/reviews`에 위치한 젠하이저 음향기기 리뷰 플랫폼.
Next.js 15 + Tailwind CSS v4 + NextAuth v5 + Supabase + TanStack Query 기반의 다크 미니멀 테마.
사용자 인증(Google OAuth), 리뷰 CRUD, URL 쿼리 필터링 기능 제공.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **인증**: NextAuth v5 (Google OAuth)
- **DB**: Supabase (PostgreSQL)
- **서버 상태**: TanStack Query v5
- **공유 컴포넌트**: `@repo/ui` (shadcn/ui 기반)
- **언어**: TypeScript 5
- **포트**: `localhost:3002`

## 목표 기능
- **사용자 인증**: Google 소셜 로그인, 세션 관리
- **리뷰 CRUD**: 작성 / 조회 / 수정 / 삭제 (작성자 본인만 수정·삭제)
- **필터링**: 카테고리(이어폰/헤드폰/DAC/앰프), 별점
- **정렬**: 최신순, 별점순
- **리뷰 시스템**: 별점, 본문, 좋아요

## 라우트 구조
```
/                   → 랜딩 (최신 리뷰 미리보기 + 로그인 유도)
/login              → Google 소셜 로그인
/reviews            → 리뷰 목록 (필터 + 정렬, URL 쿼리 파라미터)
/reviews/[id]       → 리뷰 상세
/reviews/new        → 리뷰 작성 (로그인 필요)
/reviews/[id]/edit  → 리뷰 수정 (작성자 본인만)
```

## 사용자 흐름
1. 비로그인 → 목록/상세 읽기 가능, 작성 시도 시 `/login` redirect
2. Google 소셜 로그인 → 세션 발급
3. 리뷰 작성 (카테고리, 제품명, 별점, 본문) → 목록 즉시 반영
4. 목록에서 필터·정렬 적용 → URL 쿼리 파라미터로 상태 관리

## 프로젝트 구조
```
apps/reviews/
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── auth.ts                       # NextAuth v5 설정 (handlers, auth, signIn, signOut)
    ├── app/
    │   ├── layout.tsx                # Providers(SessionProvider + QueryClientProvider) 포함
    │   ├── page.tsx                  # 랜딩
    │   ├── globals.css
    │   ├── login/page.tsx            # Google 로그인
    │   ├── reviews/                  # (다음 작업)
    │   └── api/auth/[...nextauth]/
    │       └── route.ts              # NextAuth handlers
    ├── components/
    │   ├── layout/
    │   │   ├── Providers.tsx         # SessionProvider + QueryClientProvider
    │   │   └── Header.tsx            # (다음 작업)
    │   ├── product/                  # (다음 작업)
    │   ├── review/                   # (다음 작업)
    │   └── auth/
    │       └── LoginButton.tsx
    ├── lib/
    │   └── supabase/
    │       └── client.ts             # Supabase 브라우저 클라이언트
    ├── hooks/                        # (다음 작업)
    ├── queries/                      # (다음 작업)
    └── types/                        # (다음 작업)
```

## 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Supabase 테이블 설계
```sql
users:    id, email, name, avatar_url, created_at
products: id, name, category, image_url, description  (seed 데이터)
reviews:  id, user_id, product_id, rating, title, body, created_at, updated_at
likes:    id, user_id, review_id  (선택)
```

## 주요 명령어
```bash
# apps/reviews 에서
pnpm dev              # Next.js 개발 서버 (--turbopack, localhost:3002)
pnpm build            # Next.js 빌드
```

## 중요 설정
- `src/auth.ts`: NextAuth v5 루트 파일 — `handlers`, `auth`, `signIn`, `signOut` export
- `app/api/auth/[...nextauth]/route.ts`: `export const { GET, POST } = handlers`
- `next.config.ts`: `transpilePackages: ['@repo/ui']`, `turbopack.root` 모노레포 루트 지정
- `globals.css`: `@source "../../../packages/ui/src"` — packages/ui 클래스 스캔
- 모든 클라이언트 컴포넌트는 `"use client"` 선언

## 진행 현황
- [x] 앱 스캐폴딩 (Next.js 15, Tailwind v4, @repo/ui 연동)
- [x] Supabase 프로젝트 생성 및 클라이언트 연동
- [x] NextAuth v5 Google OAuth 로그인 구현
- [x] TanStack Query Provider 설정
- [ ] Supabase 테이블 생성 + seed 데이터
- [ ] 제품 목록 페이지 + ProductCard
- [ ] URL 쿼리 필터
- [ ] 리뷰 CRUD
- [ ] 반응형 레이아웃
- [ ] Vercel 배포
