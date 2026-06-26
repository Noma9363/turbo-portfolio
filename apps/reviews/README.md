# Reviews

**라이브 데모**: https://turbo-portfolio-reviews.vercel.app/reviews

젠하이저 음향기기 리뷰 플랫폼. Google 소셜 로그인 기반 사용자 인증과 리뷰 CRUD, 카테고리 필터링 기능을 제공합니다.

## 구현된 기능

- **인증** — Google 소셜 로그인 (NextAuth v5) + 세션 관리
- **리뷰 조회** — Supabase에서 products join으로 전체 리뷰 목록 렌더
- **카테고리 필터** — URL 쿼리 파라미터 기반 (headphone / earphone / dac / amp)
- **리뷰 작성** — 로그인 필수, Server Action + FormData + revalidatePath
- **별점 입력** — shadcnstudio Rating 컴포넌트 + hidden input으로 FormData 전달
- **Dialog 폼** — 리뷰 작성 버튼 → full-screen Dialog, 뒷배경 클릭/Cancel로 닫기

## 시작하기

```bash
# 루트에서
pnpm dev

# 또는 apps/reviews 에서
pnpm dev   # localhost:3002
```

## 기술 스택

- Next.js 15 (App Router)
- Tailwind CSS v4
- NextAuth v5 + Google OAuth
- Supabase (PostgreSQL)
- TanStack Query v5
- TypeScript 5
- `@repo/ui` 공유 컴포넌트 (shadcn/ui 기반)
