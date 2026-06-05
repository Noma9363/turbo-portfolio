# reviews

## 앱 개요
Turborepo 모노레포(`turbo-portfolio`) 내 `apps/reviews`에 위치한 음향기기 리뷰 플랫폼.
Next.js 15 + Tailwind CSS v4 + NextAuth 기반의 다크 미니멀 테마.
사용자 인증(SNS 소셜 로그인), 리뷰 CRUD, 필터링·정렬 기능 제공.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **인증**: NextAuth v5 (Google / GitHub OAuth)
- **공유 컴포넌트**: `@repo/ui` (shadcn/ui 기반)
- **언어**: TypeScript 5
- **포트**: `localhost:3002`

## 목표 기능
- **사용자 인증**: 소셜 로그인 (Google, GitHub), 세션 관리
- **리뷰 CRUD**: 작성 / 조회 / 수정 / 삭제 (작성자 본인만 수정·삭제)
- **필터링**: 카테고리(이어폰/헤드폰/DAC/앰프), 브랜드, 별점
- **정렬**: 최신순, 인기순(좋아요), 별점순
- **리뷰 시스템**: 별점, 본문, 이미지 업로드, 좋아요
- **댓글**: 리뷰 상세 페이지 댓글

## 라우트 구조
```
/                   → 랜딩 (최신 리뷰 미리보기 + 로그인 유도)
/login              → 소셜 로그인
/reviews            → 리뷰 목록 (필터 + 정렬)
/reviews/[id]       → 리뷰 상세 + 댓글
/reviews/new        → 리뷰 작성 (로그인 필요)
/reviews/[id]/edit  → 리뷰 수정 (작성자 본인만)
/profile/[id]       → 사용자 프로필 + 작성 리뷰 목록
```

## 사용자 흐름
1. 비로그인 → 목록/상세 읽기 가능, 작성 시도 시 `/login` redirect
2. 소셜 로그인 → 세션 발급
3. 리뷰 작성 (카테고리, 브랜드, 제품명, 별점, 본문) → 목록 즉시 반영
4. 목록에서 필터·정렬 적용 → URL 쿼리 파라미터로 상태 관리
5. 상세 페이지 → 좋아요, 댓글

## 프로젝트 구조 (예정)
```
apps/reviews/
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx              # 랜딩
    │   ├── globals.css
    │   ├── login/
    │   │   └── page.tsx
    │   ├── reviews/
    │   │   ├── page.tsx          # 목록
    │   │   ├── new/page.tsx      # 작성
    │   │   └── [id]/
    │   │       ├── page.tsx      # 상세
    │   │       └── edit/page.tsx # 수정
    │   └── profile/
    │       └── [id]/page.tsx
    ├── components/
    │   ├── ReviewCard.tsx
    │   ├── ReviewForm.tsx
    │   ├── FilterBar.tsx
    │   └── SortSelect.tsx
    └── lib/
        └── auth.ts               # NextAuth 설정
```

## 주요 명령어
```bash
# 루트에서
pnpm dev              # 전체 개발 서버

# apps/reviews 에서
pnpm dev              # Next.js 개발 서버 (--turbopack, localhost:3002)
pnpm build            # Next.js 빌드
```

## 중요 설정
- `next.config.ts`: `transpilePackages: ['@repo/ui']`
- `globals.css`: `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` — packages/ui 클래스 스캔
- shadcn 컴포넌트 설치 후 `@/` 경로 → 상대 경로 수동 수정
