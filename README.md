# turbo-portfolio

프론트엔드 개발자 포트폴리오. Turborepo + pnpm workspaces 기반 모노레포로, 아래 4개 앱과 공유 UI 패키지(`packages/ui`)로 구성되어 있습니다.

## 앱 구성

### [portfolio](./apps/portfolio) — 메인 포트폴리오
프론트엔드 개발 경험과 프로젝트를 소개하는 원페이지 포트폴리오
<br/>
**라이브**: https://turbo-portfolio-portfolio.vercel.app/
<br/>
**기술**: Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion

**구현 포인트**
- Hero / About / Projects / Contact 섹션 구성, Framer Motion으로 섹션 애니메이션 적용
- `packages/ui` 공유 컴포넌트를 사용

### [reviews](./apps/reviews) — 음향기기 리뷰 플랫폼
Google OAuth 인증과 Supabase 기반 음향기기 리뷰 플랫폼
<br/>
**라이브**: https://turbo-portfolio-reviews.vercel.app/reviews
<br/>
**기술**: Next.js 15, TypeScript, NextAuth v5, Supabase (PostgreSQL), Server Actions, Tailwind CSS v4

**구현 포인트**
- NextAuth v5 `signIn` 콜백에서 서버 전용 Supabase 클라이언트로 `users` 테이블을 upsert해 소셜 로그인 사용자와 DB 동기화
- Server Actions로 리뷰 작성/삭제, `revalidatePath`로 목록과 상세 갱신. 삭제 쿼리에 `user_id` 조건을 걸어 작성자 본인만 삭제
- `useActionState`로 서버 검증 에러를 폼에 렌더
- searchParams 기반 카테고리 필터링 (서버 컴포넌트 재렌더)
- 모든 테이블에 RLS 활성화, 공개 데이터(products, reviews)만 읽기 정책 허용

**미구현**: 리뷰 수정, 정렬, 좋아요 기능 (`likes` 테이블은 설계만 완료)

### [taski](./apps/taski) — 칸반 일정 관리 앱
드래그앤드롭으로 우선순위를 조정하는 칸반형 일정 관리 앱
<br/>
**라이브**: https://turbo-portfolio-taski.vercel.app
<br/>
**기술**: Next.js 15, TypeScript, Zustand, Dnd-kit, Tailwind CSS v4

**구현 포인트**
- Zustand `persist` 미들웨어로 클라이언트 상태를 localStorage에 저장 (서버 저장 없음)
- Dnd-kit(`DndContext`, `SortableContext`)으로 드래그앤드롭 우선순위 조정

### [classbook](./apps/classbook) — 공간 예약 플랫폼
회의실·스터디룸·강의실 등 공간을 시간 단위로 예약하는 플랫폼
<br/>
**라이브**: https://turbo-portfolio-classbook.vercel.app/venues
<br/>
**기술**: Next.js 15, TypeScript, NextAuth v5, Supabase (PostgreSQL), Server Actions, Tailwind CSS v4, 카카오맵 SDK

**구현 포인트**
- 공간 목록(grid/list 전환, 카테고리·가격 필터), 상세(갤러리, 탭, 카카오맵), 예약 폼(날짜·시간 선택), 마이페이지(찜/예약)
- Server Actions로 예약 생성/취소, `revalidatePath`로 화면 갱신
- 모든 테이블에 RLS 활성화, `venues`만 공개 읽기 정책 허용

**미구현**: 예약 시간 중복 검사 (구현 준비 중)

## 공통 기술 스택
- Turborepo + pnpm workspaces
- TypeScript 5
- 공유 컴포넌트: `packages/ui` (shadcn/ui 기반), UI 패키지에 Storybook 8 환경 구성

## 모노레포 이슈 기록
- Tailwind v4에서 `packages/ui`의 클래스가 빌드에서 제외되는 문제를 각 앱 `globals.css`의 `@source` 지시자로 해결

## 로컬 실행
```bash
pnpm install
pnpm dev
```
