# Reviews

음향기기 리뷰 플랫폼. 소셜 로그인 기반 사용자 인증과 리뷰 CRUD, 필터링·정렬 기능을 제공합니다.

## 기능

- **인증** — Google / GitHub 소셜 로그인 (NextAuth v5)
- **리뷰 CRUD** — 작성 / 조회 / 수정 / 삭제
- **필터링** — 카테고리(이어폰/헤드폰/DAC/앰프), 브랜드, 별점
- **정렬** — 최신순 / 인기순 / 별점순
- **리뷰 시스템** — 별점, 본문, 좋아요, 댓글

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
- NextAuth v5
- TypeScript 5
- `@repo/ui` 공유 컴포넌트
