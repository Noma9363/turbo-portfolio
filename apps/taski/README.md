# taski

> Turborepo 모노레포(`turbo-portfolio`) 내 일정 관리 앱

다크 미니멀 테마의 할 일 관리 앱입니다. 카테고리 타입(체크리스트 / 섹션 / 칸반)에 따라 다른 레이아웃을 렌더링하며, 드래그앤드롭으로 순서 및 상태를 변경할 수 있습니다.

**[라이브 데모 →](https://turbo-portfolio-taski.vercel.app/)**

---

## 스크린샷

_추가 예정_

---

## 기술 스택

| 분류 | 라이브러리 |
|------|-----------|
| 프레임워크 | Next.js 15 (App Router), React 19 |
| 스타일 | Tailwind CSS v4 |
| 상태 관리 | Zustand v5 (`persist` → localStorage) |
| DnD | @dnd-kit/core · @dnd-kit/sortable · @dnd-kit/utilities |
| 공유 UI | @repo/ui (shadcn 기반 — Button, DropdownMenu, ButtonGroup, Sheet, Tooltip, Input, Skeleton) |
| 애니메이션 | tailwindcss-animate |
| 언어 | TypeScript 5 |

---

## 구현 기능

### 카테고리
- 추가 / 이름 편집 / 삭제 (최소 1개 유지)
- 타입 선택: **체크리스트** · **섹션** · **칸반**
- id 기반 참조 — 이름 변경 시 태스크 데이터에 영향이 없습니다

### 체크리스트 뷰
- 완료 / 미완료 섹션 분리
- 드래그앤드롭 순서 변경

### 섹션 뷰
- 할 일 / 진행 중 / 완료 세로 섹션
- 섹션 접기 / 펼치기
- 드래그앤드롭으로 섹션 간 이동 + 섹션 내 순서 변경
- 태스크 선택(체크박스) → 벌크 상태 변경 / 삭제
- 우선도 드롭다운 (1~5 + 급함)

### 칸반 뷰
- 할 일 / 진행 중 / 완료 / 취소됨 가로 컬럼
- 드래그앤드롭으로 컬럼 간 이동 + 컬럼 내 순서 변경
- 우선도 드롭다운 (1~5 + 급함)
- 모바일: 컬럼 고정 너비(256px) + 가로 스크롤

### 반응형
- 모바일(`md` 미만): 햄버거 버튼 → Sheet 드로어로 Sidebar 표시 (easeOutElastic 슬라이드인)
- 데스크탑(`md` 이상): 좌측 고정 Sidebar 유지
- 아이템 전체 드래그 가능 — SectionView, TodoItem 모두 `li` 전체가 드래그 트리거

---

## 로컬 실행

```bash
# 루트에서
pnpm dev

# apps/taski 에서
pnpm dev    # localhost:3001
pnpm build
```

---

## 프로젝트 구조

```
apps/taski/src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx          # Server Component — Sidebar + TodoList + InputBar
│   └── globals.css       # Tailwind v4 @theme (다크 미니멀 색상 변수)
├── components/
│   ├── Sidebar.tsx           # 카테고리 목록 · 추가 · 편집 · 삭제
│   ├── SidebarEditInput.tsx  # 카테고리 인라인 편집
│   ├── ActionButton.tsx      # MoreVertical → DropdownMenu
│   ├── CategoryAddInput.tsx  # 카테고리 추가 + 타입 선택
│   │
│   ├── TodoList.tsx          # 타입별 switch 분기 라우터
│   ├── ChecklistView.tsx     # 체크리스트 + DnD
│   ├── SectionTodoList.tsx   # 섹션 뷰 래퍼 (selectedIds 상태 보유)
│   ├── SectionView.tsx       # 섹션 뷰 + 멀티 컨테이너 DnD
│   ├── SectionAddInput.tsx   # 섹션 툴바 (일정 추가 · 벌크 액션)
│   ├── KanbanView.tsx        # 칸반 뷰 + DnD
│   │
│   ├── TodoItem.tsx          # 체크리스트 아이템 (useSortable 포함)
│   └── InputBar.tsx          # 하단 입력바 (checklist 전용)
└── store/
    └── taskStore.ts          # Zustand 스토어 (persist, version: 2)
```

---

## 트러블슈팅

### 1. `packages/ui`에 shadcn 컴포넌트 설치 후 경로 오류

**이전**
shadcn CLI로 `packages/ui` 내부에 컴포넌트를 설치했습니다.

**문제발생**
CLI가 생성하는 import 경로가 `@/lib/utils`, `@/components/ui/...` 같은 앱 전용 alias를 사용합니다. `packages/ui`에는 해당 alias가 없어 런타임 오류가 발생했습니다.

**수정**
설치 후 수동으로 상대 경로로 교체했습니다.

```ts
// ❌ 설치 직후
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// ✅ 수정 후
import { cn } from "../../lib/utils"
import { Separator } from "./separator"
```

**결과**
모노레포 패키지 내부에서 shadcn 컴포넌트를 정상적으로 사용할 수 있게 됐습니다.

---

### 2. shadcn CLI가 기존 `button.tsx` 덮어쓰기 시도

**이전**
`button-group` 컴포넌트를 CLI로 설치했습니다.

**문제발생**
CLI가 의존성으로 `button.tsx`도 함께 설치하려 했습니다. 이미 커스텀으로 작성해 둔 `Button` 컴포넌트가 덮어써질 위험이 있었습니다.

**수정**
CLI의 덮어쓰기 프롬프트에서 `N`으로 스킵했습니다.

```bash
echo "N" | pnpm dlx shadcn@latest add button-group
```

**결과**
기존 커스텀 Button을 유지하면서 `button-group`만 추가할 수 있었습니다.

---

### 3. `"use client"` 누락으로 서버 컴포넌트 오류

**이전**
Next.js App Router 환경에서 컴포넌트를 작성할 때 `"use client"` 선언을 일부 파일에서 누락했습니다.

**문제발생**
`useState`, Zustand hook, 이벤트 핸들러(`onClick`) 등을 사용하는 컴포넌트에서 빌드 오류가 발생했습니다. 누락 파일: `ActionButton.tsx`, `SidebarEditInput.tsx`

**수정**
클라이언트 기능(훅, 이벤트 핸들러)을 하나라도 사용하는 파일 상단에 `"use client"`를 추가했습니다.

**결과**
서버/클라이언트 컴포넌트 경계가 명확해졌고, 빌드가 정상적으로 통과했습니다.

---

### 4. Zustand `persist` + localStorage 버전 충돌

**이전**
Category 타입을 `string`에서 `{ id, name, type }` 객체로 변경했습니다.

**문제발생**
기존 localStorage에 저장된 데이터 구조가 달라 파싱 오류가 발생했습니다. 새 타입으로 접근하면 앱이 깨진 상태로 실행됐습니다.

**수정**
`version` 번호를 올려 구 형식 데이터를 자동 폐기하도록 설정했습니다.

```ts
persist(fn, { name: "taski-storage", version: 2 })
```

**결과**
스토어 구조가 바뀔 때마다 버전을 올리는 것으로 하위 호환 문제를 관리할 수 있게 됐습니다.

---

### 5. `DragOverlay` 내부에서 `useSortable` 사용 불가

**이전**
드래그 중 보여줄 유령 카드로 기존 카드 컴포넌트를 `DragOverlay` 내부에 그대로 재사용했습니다.

**문제발생**
`DragOverlay`는 `SortableContext` 외부에 렌더됩니다. 내부에서 `useSortable`을 호출하면 컨텍스트를 찾지 못해 오류가 발생했습니다.

**수정**
DragOverlay 내부를 `useSortable` 없는 간단한 프리뷰 `<div>`로 대체했습니다.

```tsx
<DragOverlay>
  {activeTask && (
    <div className="p-3 rounded-lg bg-card border border-border shadow-xl">
      <p className="text-sm">{activeTask.text}</p>
    </div>
  )}
</DragOverlay>
```

**결과**
드래그 중 유령 카드가 정상적으로 렌더되며 오류가 사라졌습니다.

---

### 6. 드래그 시 클릭 이벤트(체크박스) 오작동

**이전**
`PointerSensor` 기본 설정으로 DnD를 구성했습니다.

**문제발생**
포인터가 닿는 순간 드래그가 시작되어, 체크박스 클릭이 드래그로 인식됐습니다. 클릭과 드래그를 구분할 수 없었습니다.

**수정**
`activationConstraint`를 추가해 5px 이상 이동 시에만 드래그가 시작되도록 설정했습니다.

```ts
useSensor(PointerSensor, {
  activationConstraint: { distance: 5 },
})
```

**결과**
5px 미만 이동은 클릭, 이상은 드래그로 자동 구분됩니다.

---

### 7. TypeScript strict — 배열 첫 번째 요소 `possibly undefined`

**이전**
기본 활성 카테고리를 `DEFAULT_CATEGORIES[0].id`로 참조했습니다.

**문제발생**
TypeScript strict 모드에서 배열 인덱스 접근은 `T | undefined`로 추론됩니다. `.id` 접근 시 `possibly undefined` 오류가 발생했습니다.

**수정**
고정 id를 별도 상수로 분리했습니다.

```ts
// ❌
activeCategory: DEFAULT_CATEGORIES[0].id

// ✅
const DEFAULT_ACTIVE_ID = "default-work";
activeCategory: DEFAULT_ACTIVE_ID
```

**결과**
타입 오류가 사라지고, 기본 활성 카테고리의 의도가 코드에서 명확하게 드러납니다.

---

### 8. 드래그 중 텍스트 선택 현상

**이전**
DnD 이벤트 중 특별한 텍스트 선택 방지 처리가 없었습니다.

**문제발생**
드래그하는 동안 포인터가 텍스트 위를 지나면 브라우저가 자동으로 텍스트를 선택했습니다. 카드 제목, 컬럼 헤더, 버튼 텍스트 등이 드래그 중 하이라이트됐습니다.

**수정**
`layout.tsx`의 `body`에 `select-none`을 전역 적용했습니다. Linear와 동일한 방식으로, 텍스트 복사가 필요한 영역(`textarea` 등)에만 `select-text`로 opt-in합니다.

```tsx
<body className="... select-none">{children}</body>
```

**결과**
드래그 중 텍스트 선택 현상이 사라졌습니다.

---

### 9. 그립 버튼에서만 드래그 가능

**이전**
`useSortable`의 `listeners`를 카드 내부의 그립 버튼(`⠿`)에만 연결했습니다.

**문제발생**
카드의 다른 영역을 클릭해도 드래그가 시작되지 않았습니다. Linear 등 대부분의 칸반 앱은 카드 전체 영역에서 드래그가 가능해 사용성이 떨어졌습니다.

**수정**
`listeners`와 `attributes`를 카드 외부 `div`로 이동했습니다. 내부 버튼(우선도 드롭다운, 삭제)은 `onPointerDown stopPropagation`으로 드래그 이벤트를 차단했습니다.

```tsx
// ❌ 이전 — 그립 버튼에만 연결
<button {...attributes} {...listeners}>
  <GripVertical />
</button>

// ✅ 수정 후 — 카드 전체에 연결
<div {...attributes} {...listeners}>
  <GripVertical /> {/* 시각적 힌트만 */}
  ...
</div>
```

**결과**
카드 어디서나 드래그할 수 있으며, 내부 버튼은 독립적으로 동작합니다.

---

### 11. Sheet 애니메이션이 전혀 동작하지 않음

**이전**
shadcn Sheet 컴포넌트를 설치하고 모바일 사이드바 드로어로 사용했습니다.

**문제발생**
`slide-in-from-left`, `animate-in` 등 Sheet의 애니메이션 클래스가 적용되지 않아 드로어가 애니메이션 없이 즉시 나타났습니다.

**수정**
원인은 두 가지였습니다.
1. `tailwindcss-animate` 패키지 미설치
2. `globals.css`에 플러그인 등록 누락

```bash
pnpm add tailwindcss-animate
```
```css
/* globals.css */
@plugin "tailwindcss-animate";
```

**결과**
`animate-in`, `slide-in-from-left`, `fade-in-0` 등 tailwindcss-animate 클래스가 정상 동작합니다.

---

### 12. `DialogContent` 접근성 경고 — SheetTitle 누락

**이전**
`SheetContent` 안에 `SheetTitle` 없이 `<Sidebar />`만 렌더했습니다.

**문제발생**
Radix UI의 Sheet는 내부적으로 Dialog 기반입니다. 스크린 리더 접근성을 위해 `DialogTitle`이 필수로 요구됩니다. 콘솔에 경고가 출력됐습니다.

**수정**
`sr-only` 클래스로 시각적으로 숨긴 `SheetTitle`을 추가했습니다.

```tsx
<SheetContent side="left">
  <SheetTitle className="sr-only">메뉴</SheetTitle>
  <Sidebar />
</SheetContent>
```

**결과**
접근성 경고가 사라졌습니다. `sr-only`는 화면에는 보이지 않고 스크린 리더에만 읽힙니다.

---

### 13. 모바일 칸반 컬럼이 1/4 크기로 압축됨

**이전**
`KanbanColumn`에 `flex-1 min-w-0`을 적용해 4컬럼이 가용 너비를 균등 분할하도록 설정했습니다.

**문제발생**
모바일(375px)에서 각 컬럼이 약 87px로 압축됐습니다. 부모에 `overflow-x-auto`가 있었지만 컬럼이 줄어들어버려 가로 스크롤이 발생하지 않았습니다.

**수정**
모바일에서 고정 너비를 부여하고, 데스크탑에서만 `flex-1`을 적용했습니다.

```tsx
// ❌ 이전
className="flex flex-col flex-1 min-w-0"

// ✅ 수정 후
className="flex flex-col shrink-0 w-64 md:flex-1 md:min-w-[200px]"
```

**결과**
모바일에서 4컬럼 합계 1024px이 되어 `overflow-x-auto`로 가로 스크롤이 정상 동작합니다.

---

### 10. 우선도 드롭다운 선택 시 상세 모달 오픈

**이전**
카드 전체 `div`에 `onClick={() => onOpenDetail(task)}`를 연결했습니다.

**문제발생**
우선도 드롭다운 메뉴 아이템을 클릭하면 우선도가 변경되면서 상세 모달까지 열렸습니다.

`DropdownMenuContent`는 DOM 위치는 포털(`body` 하위)이지만, **React 컴포넌트 트리**상으로는 카드의 자식입니다. React의 synthetic event는 DOM 트리가 아닌 React 컴포넌트 트리를 따라 버블링하기 때문에, 포털 내부 클릭이 카드의 `onClick`까지 전파됐습니다.

```
DropdownMenuItem 클릭
  → React 트리 버블링
  → KanbanCard div.onClick
  → onOpenDetail 실행 ✗
```

**수정**
`DropdownMenu` 전체를 `onClick` + `onPointerDown` stopPropagation div로 감쌌습니다.

```tsx
<div
  onClick={(e) => e.stopPropagation()}
  onPointerDown={(e) => e.stopPropagation()}
>
  <DropdownMenu>...</DropdownMenu>
</div>
```

**결과**
우선도 변경은 우선도 변경만, 카드 클릭은 상세 모달만 독립적으로 동작합니다.

---

## 상태 관리 (Zustand)

```
taski-storage (localStorage)
├── tasks: Task[]
├── categories: Category[]
└── activeCategory: string (Category.id)
```

`version: 2` — 구 형식 데이터와의 충돌을 방지합니다. 버전이 다르면 저장된 데이터를 폐기하고 초기값으로 시작합니다.
