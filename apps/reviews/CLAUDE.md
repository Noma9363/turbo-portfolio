# reviews

## 🔖 세션 시작 시 Claude가 읽어야 할 현황 요약
> `/clear` 후 새 세션에서 이 블록을 먼저 읽고 핵심 상황을 파악할 것

- **브랜치**: `feat/audioreview` / **포트**: `localhost:3002`
- **현재 단계**: 상세 페이지 + getOrCreateUser 완료 → 다음은 **ReviewCard 스타일링 + 빈 상태 처리 + 배포**
- **오늘 완료 (6/18)**: /reviews/[id] 상세 페이지, getReviewsByProductId, ReviewWithUser 타입, ProductCard Link, getOrCreateUser(signIn 콜백 + supabaseAdmin), RLS users 비활성화, createReviewAction redirect 수정
- **다음 작업 (6/19)**: ReviewCard 스타일링, 빈 상태 처리, Vercel 배포
- **마감**: 2026-06-20 (금) — Vercel 배포까지
- **협업 원칙**: 구현 전 항상 "어떻게 만들려고 해?" 먼저 물을 것. 코드 대신 방향/키워드만. 파일 전체 작성 금지.

---

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
    │   ├── reviews/
    │   │   └── page.tsx              # (진행 중 — searchParams 구조 설계 중)
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
    ├── queries/
    │   ├── products.ts               # getProducts, getProductsByCategory, getProductById
    │   └── reviews.ts                # getAllReviews (products join 포함)
    └── types/
        └── database.ts               # user, products, reviews, likes, ReviewWithProduct
```

## 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # auth.ts signIn 콜백에서 getOrCreateUser 용도 (서버 전용, NEXT_PUBLIC_ 금지)
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

## Supabase MCP
- **설정 위치**: 루트 `.mcp.json` (gitignore됨 — PAT 포함)
- **project-ref**: `aynbwrurevrfmrfxplsd`
- **토큰 이름**: `supabase-claude-mcp` (만료: 30일)
- Claude Code 재시작 후 `/mcp` 로 연결 확인
- FK 관계: `reviews.user_id → users.id`, `reviews.product_id → products.id`

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
- `globals.css`: `@source "../../../packages/ui/src/**/*.{ts,tsx}"` — packages/ui 클래스 스캔
- `packages/ui` 새 컴포넌트 추가 시 `@/lib/utils` → `../../lib/utils`, `@/components/ui/xxx` → `./xxx` 로 경로 수정 필수
- 모든 클라이언트 컴포넌트는 `"use client"` 선언

## 진행 현황
- [x] 앱 스캐폴딩 (Next.js 15, Tailwind v4, @repo/ui 연동)
- [x] Supabase 프로젝트 생성 및 클라이언트 연동
- [x] NextAuth v5 Google OAuth 로그인 구현
- [x] TanStack Query Provider 설정
- [x] Supabase 테이블 생성 + seed 데이터 (users, products, reviews, likes + category ENUM)
- [x] src/queries/products.ts — getProducts, getProductsByCategory, getProductById
- [x] src/types/database.ts — ReviewWithProduct 타입 추가 (reviews + products join 대응)
- [x] src/queries/reviews.ts — getAllReviews (products name/category join)
- [x] reviews/page.tsx — searchParams 구조 + 목록 렌더링 완성 (목 6/11)
- [x] Supabase DB 수정 — FK constraint (reviews.product_id → products.id), RLS disable (products/reviews), user_id nullable
- [x] ProductCard 컴포넌트 (금 6/12)
- [x] URL 쿼리 필터 — FilterBar + router.push + 서버 filter 연결 (금 6/12)
- [x] ProductCard 스타일 + 그리드 레이아웃 + 반응형 (월 6/16)
- [x] 리뷰 create — Server Action + auth() 세션 + revalidatePath (월 6/16)
- [x] ReviewForm — Field/Input/Textarea/Rating 컴포넌트 구성 + hidden input으로 FormData 전달
- [x] ReviewFormDialog — full-screen Dialog + 뒷배경 클릭/Cancel 닫기 + open 상태 관리
- [x] packages/ui — rating.tsx, field.tsx, label.tsx, textarea.tsx @/ 경로 수정
- [x] 리뷰 delete — deleteReview(id, userId) + deleteReviewAction + ReviewCard + DeleteConfirmDialog (화 6/17)
- [x] ReviewCard — ReviewWithUser 타입으로 변경 (products join 제거), currentUserId prop
- [x] reviews/page.tsx — getProducts() 독립 fetch, null 체크 수정 (6/18)
- [x] reviews/[id]/page.tsx — 상품 상세 페이지 신규 생성 (6/18)
- [x] getReviewsByProductId — ReviewWithUser 반환, product_id 기준 필터 (6/18)
- [x] ReviewWithUser 타입 추가 — reviews + users(name) join 전용 (6/18)
- [x] ProductCard — Link로 /reviews/[id] 이동 연결 (6/18)
- [x] auth.ts — signIn 콜백 + supabaseAdmin으로 getOrCreateUser 구현 (6/18)
- [x] RLS — users 테이블 비활성화 (6/18)
- [x] createReviewAction — redirect를 /reviews/${product_id}로 수정 (6/18)
- [x] Separator — packages/ui index.ts export 추가 (6/18)
- [ ] ReviewCard 스타일링
- [ ] 빈 상태/로딩 처리
- [ ] Vercel 배포

## 다음 작업 (6/19)
1. **ReviewCard 스타일링** — 아바타 이니셜, rating 별표, 날짜 포맷, 카드 레이아웃
2. **빈 상태 처리** — 리뷰 없을 때 empty state UI
3. **Vercel 배포** — 환경변수 설정 포함

### 레이아웃 결정 (6/18)
- `/reviews` — 상품 카드 그리드만 렌더 (products 독립 fetch)
- `/reviews/[id]` — 상품 상세 + 평균 별점 + ReviewFormDialog + 리뷰 목록
- 상세 페이지에서 submit 후 같은 페이지로 redirect (revalidatePath + redirect product_id 기준)

### 중요 결정 (6/18)
- `getOrCreateUser`: NextAuth `signIn` 콜백에서 `supabaseAdmin`(service_role 키)으로 upsert — anon key는 RLS 때문에 insert 불가
- `ReviewWithUser` vs `ReviewWithProduct`: 상세 페이지에서 products는 별도 fetch하므로 ReviewCard는 users(name)만 필요
- Tailwind v4 + shadcn Dialog 포지셔닝 버그 — `translate-x-[-50%]` 미적용 → fullscreen 방식 유지

---

## 협업 스타일
- 반말로 대화할 것
- 짧고 간결하게

## AI 협업 원칙 (reviews — 개발 진행 중)

reviews는 현재 개발 중인 프로젝트다.
코드 한 줄 한 줄을 내가 이해하고 면접에서 설명할 수 있어야 한다.

### 하지 말 것
- 파일 전체를 완성해서 주지 말 것 — 반드시 하나의 함수/컴포넌트 단위로만
- 내 설계 없이 먼저 구조를 잡아주지 말 것
- "이렇게 하면 돼"로 끝내지 말 것 — 항상 "왜"를 물을 것

### 반드시 할 것
- 구현 전에 항상 "어떤 방식으로 만들려고 해?"를 먼저 물을 것
- 내 방향이 나오면 트레이드오프(장단점)를 같이 검토할 것
- 막혀서 힌트를 요청하면 코드 대신 키워드나 방향만 줄 것
- 완성된 코드를 받은 경우 "이 코드에서 네가 설명할 수 있는 부분이 어디야?"라고 물을 것

### 이 프로젝트의 핵심 결정들 (내가 설명할 수 있어야 하는 것들)
- NextAuth vs Supabase Auth — 왜 NextAuth를 선택했는가
- Server Actions vs API Routes — 왜 Server Actions로 CRUD를 구현했는가
- 카테고리 필터를 서버가 아닌 JS에서 처리한 이유와 그 한계
- TanStack Query Provider는 설정했는데 현재 어디에도 쓰이지 않는 이유
- `getOrCreateUser` 패턴 — NextAuth와 Supabase를 어떻게 연결했는가
