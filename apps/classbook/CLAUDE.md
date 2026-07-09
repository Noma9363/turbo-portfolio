# classbook

## 🔖 세션 시작 시 Claude가 읽어야 할 현황 요약
> `/clear` 후 새 세션에서 이 블록을 먼저 읽고 핵심 상황을 파악할 것

- **브랜치**: `feat/classbook` / **포트**: `localhost:3003`
- **현재 단계**: 내 페이지 진행 중 → 다음은 **ReservationCard 구현**
- **마감**: 2026-07-10 (금) — Vercel 배포까지
- **협업 원칙**: 구현 전 항상 "어떻게 만들려고 해?" 먼저 물을 것. 코드 대신 방향/키워드만. 파일 전체 작성 금지. 반말로 대화.
- **카카오맵 주의**: 기존 앱(이전 프로젝트)의 JS 키를 사용해야 함 — 새 앱 생성 시 도메인 403 이슈 있었음

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
- `ui/alert-dialog.tsx` — shadcn AlertDialog (경로 수정: `../../lib/utils`, `./Button`)
- `ui/carousel.tsx` — shadcn Carousel (경로 수정 완료)

## 카카오맵 설정
- 기존 앱의 JS 키 사용 (새 앱 생성 시 403 이슈)
- `NEXT_PUBLIC_KAKAO_MAP_KEY` — `.env.local`에 등록
- `KakaoMap.tsx` — `useEffect` 내 동적 스크립트 로드 방식
- `declare const kakao: any` — 타입 처리
- 가드: `typeof kakao === 'undefined'` 체크 필수

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
- [x] VenueReserveForm — 예약 폼 + createReserveAction (name/phone/email/date/time/members)
- [x] SubmitButton 분리 — useFormStatus 기반 Progress 상태 (0/50/100%)
- [x] getReservationByVenueAndUser — maybeSingle로 기존 예약 조회
- [x] 기존 예약 있을 시 폼 비활성화 + 기존 데이터 표시
- [x] cancelReservationAction — reservation_id + venue_id bind 방식, AlertDialog 확인
- [x] KakaoMap 컴포넌트 — 동적 SDK 로드, 지도 렌더 완료
- [x] VenueDetailContent 위치 섹션에 KakaoMap 연동
- [x] KakaoMap 마커 추가 — Geocoder 주소→좌표 변환, &libraries=services
- [x] VenuGalleryDialog — Carousel + CarouselPrevious/Next 연결
- [x] 찜 기능 — createFavoritAction / removeFavoritAction, VenueCard Heart 아이콘 filled 분기
- [x] getFavoritesByUser / getFavoriteVenuesByUser / addFavorite / removeFavorite 쿼리
- [x] VenueListFetcher — favoritedIds 조회 후 VenueCard에 isFavorited 전달
- [x] packages/ui — Tabs 컴포넌트 추가 (경로 수정 완료)
- [x] /my/page.tsx — 프로필 카드 (Avatar + 배경 그라디언트) + Tabs 스캐폴딩
- [x] getReservationsByUser + ReservationWithVenue 타입 추가
- [ ] ReservationCard — 썸네일/날짜/status 배지/AlertDialog 취소 버튼
- [ ] /my 찜 탭 — getFavoriteVenuesByUser 데이터 렌더
- [ ] /my 예약 탭 — ReservationCard 렌더
- [ ] 로그인 페이지
- [ ] 전체 스타일링 마무리
- [ ] Vercel 배포

## 일정 목표 (7/8 기준 재조정, 마감 7/10 금요일)
| 날짜 | 시간대 | 작업 |
|------|--------|------|
| 목 7/9 | 09:30-11:00 | 카카오맵 마커 추가 |
| 목 7/9 | 11:00-13:00 | VenuGalleryDialog Carousel + 더보기 오버레이 |
| 목 7/9 | 14:00-16:00 | 찜 기능 (favorites) |
| 목 7/9 | 16:00-18:00 | 내 페이지 (간소화) |
| 금 7/10 | 09:30-11:00 | 로그인 페이지 |
| 금 7/10 | 11:00-13:00 | 전체 마무리 + 버그 수정 |
| 금 7/10 | 14:00-18:00 | Vercel 배포 + 최종 확인 |

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
