# turbo-portfolio

프론트엔드 개발자 포트폴리오. Turborepo 기반 모노레포로 구성된 다크 미니멀 원페이지 포트폴리오입니다.

**[라이브 데모 →](https://turbo-portfolio-portfolio.vercel.app/)**

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 15 (App Router), React 19 |
| 스타일링 | Tailwind CSS v4 |
| 애니메이션 | Framer Motion v11 |
| 컴포넌트 | Radix UI + CVA (Shadcn/ui 스타일) |
| 모노레포 | Turborepo + pnpm workspaces |
| 언어 | TypeScript 5 |
| 배포 | Vercel |

---

## 구현 포인트

**모노레포 구조**
- `packages/ui` — Button, Card, Badge 등 공유 컴포넌트 라이브러리
- `apps/portfolio` — 포트폴리오 앱. `@repo/ui`를 의존성으로 사용
- 앱마다 `globals.css @theme`에서 색상/폰트 토큰을 독립 관리해 멀티 앱 테마 전략 지원

**스크롤 애니메이션**
- Framer Motion `whileInView` + `staggerChildren`으로 섹션 진입 시 순차 등장
- `viewport: { once: true }` 로 재진입 시 애니메이션 반복 방지

**반응형 레이아웃**
- Navigation: 모바일 풀너비 바 / 데스크탑 중앙 pill (backdrop blur)
- `max-w-prose` 적용으로 가로 모드에서도 본문 가독성 유지

---

## 로컬 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버 (localhost:3000)
pnpm dev

# 빌드
pnpm build
```

> pnpm 10, Node.js 18+ 필요

---

## 프로젝트 구조

```
turbo-portfolio/
├── apps/
│   └── portfolio/          # Next.js 포트폴리오 앱
│       └── src/
│           ├── app/        # 라우트, 전역 스타일
│           └── components/ # 앱 전용 컴포넌트 (섹션, Navigation 등)
└── packages/
    └── ui/                 # 공유 컴포넌트 라이브러리
        └── src/
            └── components/
                ├── ui/     # shadcn 기반 기본 컴포넌트
                └── blocks/ # 복합 컴포넌트
```
