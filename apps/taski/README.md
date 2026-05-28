# taski

> Turborepo 모노레포(`turbo-portfolio`) 내 일정 관리 앱

다크 미니멀 테마의 할 일 관리 앱. 카테고리 타입(체크리스트 / 섹션 / 칸반)에 따라 다른 레이아웃을 렌더링하며, 드래그앤드롭으로 순서 및 상태를 변경할 수 있다.

**Demo**: _추가 예정_

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
| 공유 UI | @repo/ui (shadcn 기반 — Button, DropdownMenu, ButtonGroup) |
| 언어 | TypeScript 5 |

---

## 구현 기능

### 카테고리
- 추가 / 이름 편집 / 삭제 (최소 1개 유지)
- 타입 선택: **체크리스트** · **섹션** · **칸반**
- id 기반 참조 — 이름 변경 시 태스크 데이터 영향 없음

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
- 할 일 / 진행 중 / 완료 가로 컬럼
- 드래그앤드롭으로 컬럼 간 이동 + 컬럼 내 순서 변경
- 우선도 드롭다운 (1~5 + 급함)

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

shadcn CLI는 컴포넌트 설치 시 `@/lib/utils`와 `@/components/ui/...` 같은 절대 경로 alias를 사용한다. `apps/`가 아닌 `packages/ui`에 설치하면 이 alias가 존재하지 않아 런타임 오류가 발생한다.

**해결**: 설치 후 수동으로 상대 경로로 교체.

```ts
// ❌ 설치 직후
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

// ✅ 수정 후
import { cn } from "../../lib/utils"
import { Separator } from "./separator"
```

### 2. shadcn CLI가 기존 `button.tsx` 덮어쓰기 시도

`button-group` 설치 시 의존성으로 `button.tsx`도 함께 설치하려 해 커스텀 Button이 덮어써질 뻔했다.

**해결**: CLI의 덮어쓰기 프롬프트에서 `N` 입력으로 스킵.

```bash
echo "N" | pnpm dlx shadcn@latest add button-group
```

### 3. `"use client"` 누락으로 서버 컴포넌트 오류

Zustand나 이벤트 핸들러를 사용하는 컴포넌트에 `"use client"` 선언이 빠지면 Next.js App Router에서 빌드 오류가 발생한다.

**기준**: `useState`, `useEffect`, Zustand hook, 이벤트 핸들러(`onClick` 등) 중 하나라도 사용하면 `"use client"` 필요.

누락됐던 파일: `ActionButton.tsx`, `SidebarEditInput.tsx`

### 4. Zustand `persist` + localStorage 버전 충돌

Category 타입을 `string`에서 `{ id, name, type }` 객체로 변경했을 때, 기존 localStorage 데이터 형식이 달라 파싱 오류가 발생했다.

**해결**: `version: 2` 로 올려 구 형식 데이터를 자동 폐기.

```ts
persist(fn, { name: "taski-storage", version: 2 })
```

### 5. `DragOverlay` 내부에서 `useSortable` 사용 불가

`DragOverlay`는 `SortableContext` 외부에 렌더되므로, 내부에서 `useSortable`을 쓰는 컴포넌트를 그대로 재사용하면 오류가 발생한다.

**해결**: DragOverlay 내부는 `useSortable` 없는 간단한 `<div>` 프리뷰로 대체.

```tsx
<DragOverlay>
  {activeTask && (
    <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border shadow-xl">
      <GripVertical size={14} />
      <span className="text-sm">{activeTask.text}</span>
    </div>
  )}
</DragOverlay>
```

### 6. 드래그 시 클릭 이벤트(체크박스) 오작동

`PointerSensor` 기본 설정은 포인터가 닿는 순간 드래그를 시작해, 체크박스 클릭이 드래그로 인식되는 문제가 있었다.

**해결**: `activationConstraint`로 5px 이상 이동 시에만 드래그 시작.

```ts
useSensor(PointerSensor, {
  activationConstraint: { distance: 5 },
})
```

### 7. TypeScript strict — 배열 첫 번째 요소 `possibly undefined`

`DEFAULT_CATEGORIES[0].id`를 직접 참조하면 TypeScript strict 모드에서 `possibly undefined` 오류가 발생했다.

**해결**: 고정 id를 상수로 분리.

```ts
// ❌
activeCategory: DEFAULT_CATEGORIES[0].id

// ✅
const DEFAULT_ACTIVE_ID = "default-work";
activeCategory: DEFAULT_ACTIVE_ID
```

---

## 상태 관리 (Zustand)

```
taski-storage (localStorage)
├── tasks: Task[]
├── categories: Category[]
└── activeCategory: string (Category.id)
```

`version: 2` — 구 형식 데이터와의 충돌 방지. 버전이 다르면 초기값으로 리셋.
