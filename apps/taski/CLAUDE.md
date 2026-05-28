# taski

## 앱 개요
Turborepo 모노레포(`turbo-portfolio`) 내 `apps/taski` 에 위치한 일정 관리 앱.
Next.js 15 + Tailwind CSS v4 + Zustand 기반의 다크 미니멀 테마.
카테고리 타입(체크리스트/섹션/칸반)에 따라 다른 레이아웃 렌더링.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **상태 관리**: Zustand v5 (`persist` 미들웨어로 localStorage 자동 저장)
- **공유 컴포넌트**: `@repo/ui` (Button, ButtonGroup, DropdownMenu 등 — shadcn 기반)
- **DnD**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`
- **언어**: TypeScript 5
- **포트**: `localhost:3001`

## 프로젝트 구조
```
apps/taski/
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx            # Sidebar + TodoList + InputBar (Server Component)
    │   └── globals.css
    ├── components/
    │   ├── Sidebar.tsx             # 카테고리 목록, 추가/편집/삭제
    │   ├── SidebarEditInput.tsx    # 카테고리 인라인 편집 입력창
    │   ├── SidebarItem.tsx         # (예정) 카테고리 단일 아이템
    │   ├── ActionButton.tsx        # MoreVertical → DropdownMenu
    │   ├── CategoryAddInput.tsx    # 카테고리 추가 + 타입 선택 (체크/섹션/칸반)
    │   │
    │   ├── TodoList.tsx            # 카테고리 타입별 switch 분기 라우터
    │   ├── ChecklistView.tsx       # 체크리스트 뷰 (완료/미완료 섹션)
    │   ├── SectionTodoList.tsx     # 섹션 뷰 래퍼 (selectedIds state 보유)
    │   ├── SectionView.tsx         # 섹션 뷰 (접기/펼치기 + 우선도 드롭다운)
    │   ├── SectionAddInput.tsx     # 섹션 뷰 툴바 (일정 추가 / 상태 변경 / 삭제)
    │   ├── KanbanView.tsx          # 칸반 뷰 (3컬럼 + DnD)
    │   │
    │   ├── TodoItem.tsx            # 체크리스트 단일 아이템
    │   └── InputBar.tsx            # 하단 입력바 (checklist 타입일 때만 렌더)
    └── store/
        └── taskStore.ts            # Zustand 스토어 (persist, version: 2)
```

## 주요 명령어
```bash
# 루트에서
pnpm dev              # 전체 개발 서버

# apps/taski 에서
pnpm dev              # Next.js 개발 서버 (--turbopack, localhost:3001)
pnpm build            # Next.js 빌드
```

## Zustand 스토어 구조 (`taskStore.ts`)

### 타입
```ts
type CategoryType = "checklist" | "section" | "kanban"

interface Category {
  id: string        // crypto.randomUUID() — 이름 변경에 영향 없음
  name: string
  type: CategoryType
}

type TaskStatus   = "todo" | "in-progress" | "done"
type TaskPriority = 1 | 2 | 3 | 4 | 5 | "urgent"

interface Task {
  id: string
  text: string
  categoryId: string    // Category.id 참조
  completed: boolean    // checklist용
  status: TaskStatus    // section/kanban용 (기본값 "todo")
  priority?: TaskPriority  // 우선도 (선택, 미설정 시 undefined)
  createdAt: number
}
```

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| `tasks` | `Task[]` | 전체 할 일 목록 |
| `categories` | `Category[]` | 카테고리 목록 (기본: 업무/학습/루틴, type: checklist) |
| `activeCategory` | `string` | 현재 선택된 Category.id |

### 액션
| 액션 | 설명 |
|------|------|
| `setActiveCategory(id)` | 카테고리 탭 전환 |
| `addCategory(name, type)` | 카테고리 추가 (중복/빈 값 방지) |
| `deleteCategory(id)` | 카테고리 삭제 + 해당 tasks 삭제, 최소 1개 유지 |
| `editCategory(id, newName)` | 이름 변경 (tasks는 id 참조라 수정 불필요) |
| `addTask(text, status?)` | 현재 카테고리로 추가. status 생략 시 "todo" |
| `toggleTask(id)` | completed 토글 + status 동기화 (done ↔ todo) |
| `moveTask(id, status)` | status 변경 + completed 동기화 |
| `setPriority(id, priority?)` | 우선도 설정. undefined 전달 시 해제 |
| `deleteTask(id)` | 할 일 삭제 |
| `reorderTasks(activeId, overId)` | DnD 순서 변경 — flat 배열에서 splice로 위치 교환 |

### localStorage
`persist` 미들웨어로 `taski-storage` 키에 자동 저장. `version: 2` — 구 형식(string[]) 충돌 방지.

## 컴포넌트 아키텍처

### TodoList 분기 패턴
```tsx
// TodoList.tsx — 타입별 switch 분기 (라우터 역할)
switch (currentCategory?.type) {
  case "section": return <SectionTodoList tasks={filtered} />
  case "kanban":  return <KanbanView tasks={filtered} />
  default:        return <ChecklistView pending={pending} completed={completed} />
}
```

### SectionTodoList 구조 (선택 상태 관리)
```
SectionTodoList.tsx          selectedIds: string[] 보유
  ├── SectionAddInput        selectedIds + onBulkDelete + onBulkMove
  └── SectionView            selectedIds + onToggleSelect
```
- `selectedIds`는 UI 상태 → 스토어가 아닌 SectionTodoList 로컬 state
- bulk 삭제/변경은 기존 `deleteTask`, `moveTask`를 순회 호출

### InputBar 조건부 렌더
```tsx
// checklist가 아니면 null 반환 (얼리 리턴 패턴)
if (activeCategoryType !== "checklist") return null;
```

### CategoryAddInput 타입 선택
```tsx
// 내부 selectedType state 관리
const [selectedType, setSelectedType] = useState<CategoryType>("checklist");

// CATEGORY_TYPES 배열로 관리 — 타입 추가 시 배열만 수정
const CATEGORY_TYPES = [
  { type: "checklist", label: "체크",  icon: <CheckSquare /> },
  { type: "section",   label: "섹션",  icon: <AlignLeft />  },
  { type: "kanban",    label: "칸반",  icon: <LayoutGrid /> },
]

// onConfirm: (type: CategoryType) → 부모에서 addCategory(name, type) 호출
```

### SectionView 우선도 드롭다운
```tsx
// 우선도별 색상 매핑
const PRIORITY_OPTIONS = [
  { value: 1,        label: "1",   color: "text-zinc-400"        },
  { value: 2,        label: "2",   color: "text-blue-400"        },
  { value: 3,        label: "3",   color: "text-yellow-400"      },
  { value: 4,        label: "4",   color: "text-orange-400"      },
  { value: 5,        label: "5",   color: "text-red-400"         },
  { value: "urgent", label: "급함", color: "text-red-500 font-bold" },
]
```
- 트리거: `—` (미설정) / 숫자 (1~5) / `급` (urgent)
- "해제" 옵션으로 우선도 제거 (`setPriority(id, undefined)`)

### SectionView 접기/펼치기 패턴
```ts
// Set으로 관리 — 섹션 추가 시 state 수정 불필요
const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set());

const toggle = (status: TaskStatus) => {
  setCollapsed((prev) => {
    const next = new Set(prev);
    next.has(status) ? next.delete(status) : next.add(status);
    return next;
  });
};
// Set 안에 있으면 접힌 것, 없으면 펼쳐진 것
```

## DnD 패턴 (`@dnd-kit`)

### 공통 구조
```tsx
// 모든 뷰 동일 패턴
<DndContext sensors={sensors} collisionDetection={...} onDragStart onDragOver onDragEnd>
  <SortableContext items={ids} strategy={verticalListSortingStrategy}>
    {items.map(item => <SortableItem key={item.id} ... />)}
  </SortableContext>
  <DragOverlay>{activeItem && <SimplePreview />}</DragOverlay>
</DndContext>
```

### PointerSensor 설정
```ts
// 5px 이동 후 드래그 시작 — 클릭(체크박스, 버튼)과 드래그 오작동 방지
useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
```

### 멀티 컨테이너 DnD (SectionView / KanbanView)
```ts
// onDragOver — 낙관적 업데이트: 다른 섹션/컬럼으로 넘어가면 즉시 moveTask 호출
const overStatus = STATUSES.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status;
if (overStatus && draggingTask.status !== overStatus) moveTask(activeId, overStatus);

// onDragEnd — 같은 컨테이너 내 reorder만 처리 (cross-container는 onDragOver에서 완료)
if (updatedActiveTask.status === overTask.status) reorderTasks(activeId, overId);
```

### DroppableSection / KanbanColumn
```tsx
// 빈 섹션/컬럼도 드롭 타깃이 되도록 useDroppable 적용 + min-h 확보
function DroppableSection({ status, children }) {
  const { setNodeRef } = useDroppable({ id: status }); // id = TaskStatus 문자열
  return <div ref={setNodeRef} className="min-h-[32px]">{children}</div>;
}
```

### DragOverlay
- `SortableContext` 밖에서 렌더 → `useSortable` 사용 불가
- 컴포넌트 재사용 대신 간단한 `<div>` 프리뷰로 대체
- 드래그 중 원본 아이템은 `isDragging ? "opacity-40" : ""` 처리

## 컬러 테마 (`globals.css @theme`)
| 변수 | 값 | 용도 |
|------|----|------|
| `--color-background` | `#09090b` | 앱 배경 |
| `--color-foreground` | `#fafafa` | 기본 텍스트 |
| `--color-card` | `#0f0f11` | 카드 배경 |
| `--color-muted` | `#18181b` | 입력창, 호버 배경 |
| `--color-muted-foreground` | `#71717a` | 보조 텍스트 |
| `--color-border` | `#27272a` | 구분선 |
| `--color-accent` | `#27272a` | 드롭다운 아이템 호버 (`--color-popover`보다 밝아야 함) |
| `--color-popover` | `#18181b` | 드롭다운 배경 |

## 중요 설정
- `next.config.ts`: `transpilePackages: ['@repo/ui']`
- `globals.css`: `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` — packages/ui 클래스 스캔
- shadcn 컴포넌트 설치 후 `@/lib/utils` → 상대 경로로 수동 수정 필요 (`../../lib/utils`)
- `--color-accent` > `--color-popover` — 드롭다운 호버 가시성

## named group 패턴 (Tailwind v4)
```tsx
<div className="group/category relative flex items-center">
  <Button className="opacity-0 group-hover/category:opacity-100 hover:opacity-100 data-[state=open]:opacity-100">
```
- `group/category`: named group — 중첩 그룹 충돌 방지
- `data-[state=open]:opacity-100` — Radix 포털로 마우스 이동해도 유지

## @repo/ui 컴포넌트 목록
| 컴포넌트 | 설명 |
|----------|------|
| `Button` | CVA 기반, variant: default/outline/ghost/link/secondary, size: default/sm/lg/icon |
| `DropdownMenu` | Radix 기반 드롭다운 |
| `ButtonGroup` | 버튼 그룹 컨테이너 (orientation: horizontal/vertical) |
| `ButtonGroupSeparator` | 버튼 그룹 구분선 |
| `ButtonGroupText` | 버튼 그룹 텍스트 |
| `Card`, `Badge` | 공통 UI |
