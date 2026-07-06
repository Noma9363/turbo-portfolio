# classbook

## 🔖 세션 시작 시 Claude가 읽어야 할 현황 요약
> `/clear` 후 새 세션에서 이 블록을 먼저 읽고 핵심 상황을 파악할 것

- **브랜치**: `feat/classbook` / **포트**: `localhost:3003`
- **현재 단계**: venues/[id] 갤러리·상세 스캐폴딩 완료 → 다음은 **VenuGalleryDialog Carousel + 상세 정보 섹션**
- **마감**: 2026-07-10 (금) — Vercel 배포까지
- **협업 원칙**: 구현 전 항상 "어떻게 만들려고 해?" 먼저 물을 것. 코드 대신 방향/키워드만. 파일 전체 작성 금지. 반말로 대화.

---

## 개요
- **앱 경로**: `apps/classbook/` (localhost:3003)
- **목표**: 카카오맵 + 달력 SDK 연동, 예약 충돌 방지, 슬롯 가용성 계산 어필
- **Supabase project-ref**: `ncpmoqgqhpqupagzeeyw`

## 기술 스택
| 역할 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 인증 | NextAuth v5 + Google OAuth |
| DB | Supabase (PostgreSQL) |
| 서버 상태 | TanStack Query v5 |
| 지도 | 카카오맵 SDK |
| 날짜 처리 | date-fns |
| 스타일 | Tailwind CSS v4 |

## 라우트 구조
```
app/page.tsx                    # 메인 (지도 + 검색)
app/venues/page.tsx             # 전체 조회 (지도보기/목록보기 토글)
app/venues/[id]/page.tsx        # 상세 (하단 카카오맵 위치)
app/reserve/[id]/page.tsx       # 예약 페이지
app/my/page.tsx                 # 내 정보
app/my/reservations/page.tsx    # 예약 내역
app/my/favorites/page.tsx       # 찜 목록
app/login/page.tsx              # 로그인
app/api/auth/[...nextauth]/route.ts
```

## DB 테이블
```sql
users:        id, email, name, avatar_url, created_at
venues:       id, name, phone, address, latitude, longitude, thumbnail_url, images text[], price, title, sub_title, body, capacity, operating_hours, category, amenities, tags
reservations: id, user_id, venue_id, name, phone, email, start_at, end_at, members, purpose, request, status
favorites:    id, user_id, venue_id
```
- `venues.category`: `SINGLE | DOUBLE | MEETING | LECTURE`
- `reservations.status`: `WAITING | CONFIRMED | CANCELED` (DEFAULT 'WAITING')
- seed 데이터: 12개 강의실 (카테고리별 3개씩)

## 환경변수 (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_URL=http://localhost:3003
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## 주요 파일 구조
```
apps/classbook/src/
├── auth.ts
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css          # @source "../../../../packages/ui/src" (glob 없이)
│   ├── venues/page.tsx
│   └── api/auth/[...nextauth]/route.ts
├── components/
│   ├── layout/Providers.tsx
│   ├── venunes/VenueCard.tsx  # 주의: 폴더명 오타 venunes (추후 수정)
│   ├── price/PriceValue.tsx
│   └── location/LocationLabel.tsx
├── lib/supabase/client.ts
├── queries/venues.ts
└── types/database.ts
```

## packages/ui 추가 컴포넌트
- `blocks/MembersValue.tsx` — 인원 표시 (Users 아이콘 + 숫자)
- `ui/aspect-ratio.tsx` — shadcn AspectRatio

## 진행 현황
- [x] 브랜치 feat/classbook 생성
- [x] 스캐폴딩 (package.json, tsconfig, next.config, postcss, globals.css)
- [x] Supabase 프로젝트 + 테이블 4개 + seed 12개
- [x] 환경변수 + Google OAuth (localhost:3003 리디렉션 URI 추가)
- [x] auth.ts + Providers.tsx + supabase client
- [x] types/database.ts (User, Venue, Reservation, Favorite, Categories, Statuses)
- [x] queries/venues.ts (getVenues 필터 파라미터 포함, getVenueById)
- [x] venues/page.tsx — searchParams 기반 서버 필터링
- [x] VenueCard.tsx — grid/list 뷰, padding-bottom 이미지 비율, Badge overlay
- [x] VenueList.tsx — grid/list 토글
- [x] VenueListFetcher (async 서버 컴포넌트) + Suspense 구조
- [x] VenueListSkeleton / VenueCardSkeleton
- [x] FilterBar — 카테고리 Select + 가격 범위 Popover, URL searchParams 연동
- [x] venues/[id]/page.tsx — Bento 갤러리 레이아웃 (좌: 메인, 우: 2x2 그리드)
- [x] VenuGallery, VenuGalleryDialog 스캐폴딩
- [x] venues 테이블 images text[] 컬럼 추가 + seed 4장씩
- [ ] VenuGalleryDialog — Carousel 연결, 더보기 오버레이
- [ ] venues/[id] 상세 정보 섹션 (공간 정보, amenities, 카카오맵)
- [ ] 예약 사이드바 + 예약 폼 + 슬롯 로직 (핵심)
- [ ] 찜 기능
- [ ] 내 페이지 (간소화)
- [ ] 로그인 페이지
- [ ] Vercel 배포

## 일정 목표 (7/6 기준 재조정, 마감 7/10 금요일)
| 날짜 | 시간대 | 작업 |
|------|--------|------|
| 화 7/7 | 09:30-12:00 | VenuGalleryDialog — Carousel + 더보기 오버레이 |
| 화 7/7 | 14:00-18:00 | venues/[id] 상세 정보 섹션 (공간정보, amenities) |
| 수 7/8 | 09:30-12:00 | 카카오맵 연동 |
| 수 7/8 | 14:00-18:00 | 예약 사이드바 + 예약 폼 UI |
| 목 7/9 | 09:30-12:00 | 슬롯 가용성 로직 설계 (충돌 체크, 시간 계산) |
| 목 7/9 | 14:00-18:00 | 슬롯 로직 구현 + 테스트 (핵심 어필) |
| 목 7/9 | 19:00-20:00 | 슬롯 로직 마무리 점검 |
| 금 7/10 | 09:30-11:00 | 찜 기능 (favorites) |
| 금 7/10 | 11:00-12:30 | 내 페이지 (간소화) |
| 금 7/10 | 14:00-15:30 | 로그인 페이지 |
| 금 7/10 | 16:00-18:00 | Vercel 배포 + 최종 확인 |

> 매일 08:00-09:30은 운동(덤벨 서킷) 시간이라 개발 시작은 09:30부터. Google Calendar에도 동일하게 등록되어 있음(noma9363@gmail.com).

## 주의사항
- `globals.css` `@source` glob 패턴 없이 디렉토리만: `@source "../../../../packages/ui/src"`
- `components/venunes/` — 폴더명 오타 있음 (venunes), 추후 venues로 수정 필요
- `.mcp.json` project-ref: classbook(`ncpmoqgqhpqupagzeeyw`) / reviews(`aynbwrurevrfmrfxplsd`) 전환 필요

---

## AI 협업 원칙 (classbook — 개발 진행 중)

classbook은 현재 개발 중인 프로젝트다. 코드 한 줄 한 줄을 내가 이해하고 면접에서 설명할 수 있어야 한다.

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
- 예약 충돌 방지 로직 — DB 레벨(unique constraint/exclusion) vs 애플리케이션 레벨 중 어떤 걸 택했고 왜
- 슬롯 가용성 계산 방식 — operating_hours + 기존 reservations를 어떻게 조합해 가용 슬롯을 뽑는가
- 카카오맵 SDK를 클라이언트에서만 로드하는 이유
- venues.images text[] 구조를 택한 이유 (별도 테이블 대신)
