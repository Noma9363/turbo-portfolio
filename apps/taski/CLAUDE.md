# taski

## 앱 개요
Turborepo 모노레포(`turbo-portfolio`) 내 `apps/taski` 에 위치한 일정 관리 앱.
Next.js 15 + Tailwind CSS v4 + Zustand 기반의 다크 미니멀 테마.
카테고리 타입(체크리스트/섹션/칸반)에 따라 다른 레이아웃 렌더링.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **상태 관리**: Zustand v5 (`persist` 미들웨어로 localStorage 자동 저장)
- **공유 컴포넌트**: `@repo/ui` (shadcn/ui 기반 — 신규 컴포넌트는 shadcn 우선)
- **DnD**: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`
- **언어**: TypeScript 5
- **포트**: `localhost:3001`

## 컴포넌트 방향
**shadcn/ui 컴포넌트를 우선 사용한다.**
새 UI 컴포넌트가 필요할 때 `packages/ui` 에 shadcn CLI로 설치 후 `index.ts` 에 export 추가.
```bash
# packages/ui 에서 실행
pnpm dlx shadcn@latest add <component>
```
설치 후 `@/lib/utils` → `../../lib/utils`, `@/components/ui/button` → `./Button` 등 상대 경로로 수동 수정 필요.

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
    │   ├── SidebarItem.tsx         # 카테고리 단일 아이템
    │   ├── ActionButton.tsx        # MoreVertical → DropdownMenu
    │   ├── CategoryAddInput.tsx    # 카테고리 추가 + 타입 선택 (체크/섹션/칸반)
    │   │
    │   ├── TodoList.tsx            # 카테고리 타입별 switch 분기 라우터
    │   ├── ChecklistView.tsx       # 체크리스트 뷰 (완료/미완료 섹션) + DnD
    │   ├── SectionTodoList.tsx     # 섹션 뷰 래퍼 (selectedIds state 보유)
    │   ├── SectionView.tsx         # 섹션 뷰 (접기/펼치기 + 우선도 드롭다운) + DnD
    │   ├── SectionAddInput.tsx     # 섹션 뷰 툴바 (일정 추가 / 상태 변경 / 삭제)
    │   ├── KanbanView.tsx          # 칸반 보드 (4컬럼 레이아웃) + DnD
    │   ├── KanbanAddModal.tsx      # 칸반 태스크 추가 모달 (shadcn Dialog)
    │   ├── KanbanDetailModal.tsx   # 칸반 태스크 상세/편집 모달 (shadcn Dialog)
    │   │
    │   ├── TodoItem.tsx            # 체크리스트 단일 아이템 (useSortable 포함)
    │   └── InputBar.tsx            # 하단 입력바 (checklist 타입일 때만 렌더)
    └── store/
        └── taskStore.ts            # Zustand 스토어 (persist, version: 3)
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

type TaskStatus   = "todo" | "in-progress" | "done" | "canceled"
type TaskPriority = 1 | 2 | 3 | 4 | 5 | "urgent"

interface Task {
  id: string
  text: string          // 기존 뷰(checklist/section)에서 카드 텍스트로 사용
  categoryId: string    // Category.id 참조
  completed: boolean    // checklist용 (done/canceled → true)
  status: TaskStatus    // section/kanban용 (기본값 "todo")
  priority?: TaskPriority  // 우선도 (선택)
  createdAt: number

  // 칸반 상세 필드 (선택 — KanbanDetailModal에서 편집)
  title?: string        // 제목 (text와 별도 — text는 기존 뷰에서 그대로 사용)
  summary?: string      // 짧은 설명
  content?: string      // 본문
  dueDate?: number      // 마감일 (timestamp)
  assignee?: string     // 담당자
  labels?: string[]     // 레이블 태그 배열 (쉼표 구분 입력)
}
```

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| `tasks` | `Task[]` | 전체 할 일 목록 (데모 기본 데이터 포함) |
| `categories` | `Category[]` | 카테고리 목록 (기본: 포트폴리오/업무/학습/루틴) |
| `activeCategory` | `string` | 현재 선택된 Category.id (기본: "default-portfolio") |

### 액션
| 액션 | 설명 |
|------|------|
| `setActiveCategory(id)` | 카테고리 탭 전환 |
| `addCategory(name, type)` | 카테고리 추가 (중복/빈 값 방지) |
| `deleteCategory(id)` | 카테고리 삭제 + 해당 tasks 삭제, 최소 1개 유지 |
| `editCategory(id, newName)` | 이름 변경 (tasks는 id 참조라 수정 불필요) |
| `addTask(text, status?)` | 현재 카테고리로 추가. status 생략 시 "todo" |
| `toggleTask(id)` | completed 토글 + status 동기화 (done ↔ todo) |
| `moveTask(id, status)` | status 변경 + completed 동기화 (`done` \| `canceled` → true) |
| `setPriority(id, priority?)` | 우선도 설정. undefined 전달 시 해제 |
| `updateTask(id, patch)` | 칸반 상세 필드 부분 업데이트 (title/summary/content/dueDate/assignee/labels) |
| `deleteTask(id)` | 할 일 삭제 |
| `reorderTasks(activeId, overId)` | DnD 순서 변경 — flat 배열에서 splice로 위치 교환 |

### localStorage
`persist` 미들웨어로 `taski-storage` 키에 자동 저장.
`version: 3` — 버전이 다르면 저장된 데이터를 버리고 초기값(데모 데이터)으로 시작.

## 컴포넌트 아키텍처

### TodoList 분기 패턴
```tsx
switch (currentCategory?.type) {
  case "section": return <SectionTodoList tasks={filtered} />
  case "kanban":  return <KanbanView tasks={filtered} />
  default:
    if (filtered.length === 0) return <EmptyMessage />  // checklist만 빈 상태 처리
    return <ChecklistView pending={pending} completed={completed} />
}
```

### KanbanView 구조
```
KanbanView
  ├── 상단 툴바 (+ 일정 추가 → "todo" 상태로 KanbanAddModal 열기)
  ├── DndContext (pointerWithin + closestCenter 조합)
  │   └── KanbanColumn × 4 (todo / in-progress / done / canceled)
  │       ├── 컬럼 헤더 (레이블 + 카드 수)
  │       ├── + 추가 버튼 → 해당 status로 KanbanAddModal 열기
  │       └── SortableContext → KanbanCard[]
  ├── KanbanAddModal   (modalStatus !== null 일 때 표시)
  └── KanbanDetailModal (detailTask !== null 일 때 표시)
```

### KanbanDetailModal — liveTask 패턴
칸반 카드 클릭 시 `detailTask` state(스냅샷)를 설정하지만,
모달 내부에서는 Zustand 셀렉터로 **스토어를 직접 구독**해 항상 최신 데이터를 사용.
```ts
// 스냅샷(task)이 아닌 스토어에서 live 데이터 구독
const liveTask = useTaskStore(state => state.tasks.find(t => t.id === task?.id))
```
→ `setPriority`, `moveTask` 등 스토어 변경이 즉시 모달 UI에 반영됨.

### KanbanDetailModal 속성 버튼
| 버튼 | 동작 |
|------|------|
| `StatusButton` | DropdownMenu → `moveTask` |
| `PriorityButton` | DropdownMenu → `setPriority` |
| `DueDateButton` | Popover + `Calendar` → `updateTask({ dueDate })` |
| `AssigneeButton` | 인라인 input → `updateTask({ assignee })` |
| `LabelsButton` | 인라인 input (쉼표 구분) → `updateTask({ labels })` |

모든 필드는 `onBlur` 시 자동저장 (`updateTask` 호출).

### canceled 상태 스타일
```tsx
// 카드/아이템 전체 opacity + 텍스트 취소선
isDragging ? "opacity-40" : task.status === "canceled" ? "opacity-50" : ""
task.status === "done" || task.status === "canceled"
  ? "line-through text-muted-foreground"
  : "text-foreground"
```

## DnD 패턴 (`@dnd-kit`)

### 공통 구조
```tsx
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

### KanbanView 충돌 감지
```ts
// pointerWithin 우선 — 빈 컬럼 드롭 감지에 유리
// closestCenter 폴백 — 컬럼 경계 밖 드래그 시 대비
collisionDetection={(args) => {
  const over = pointerWithin(args);
  return over.length ? over : closestCenter(args);
}}
```
**KanbanColumn의 `setNodeRef`는 컬럼 최상위 div에 연결** — 빈 컬럼도 전체 영역이 드롭 타깃이 됨.

## @repo/ui 컴포넌트 목록
| 컴포넌트 | 설명 |
|----------|------|
| `Button` | CVA 기반, variant: default/outline/ghost/link/secondary, size: default/sm/lg/icon |
| `DropdownMenu` | Radix 기반 드롭다운 |
| `ButtonGroup` | 버튼 그룹 컨테이너 |
| `Card`, `Badge` | 공통 UI |
| `Dialog` | shadcn Dialog (모달) |
| `Popover` | shadcn Popover |
| `Calendar` | shadcn Calendar (`react-day-picker` v9 기반) |

## 중요 설정
- `next.config.ts`: `transpilePackages: ['@repo/ui']`
- `globals.css`: `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` — packages/ui 클래스 스캔
- `globals.css`: `@import "react-day-picker/style.css"` — Calendar 레이아웃 기반 CSS (Tailwind 이후 import)
- `globals.css`: `.rdp-*` 오버라이드 — react-day-picker 라이트 테마 색상 덮어쓰기 (`@layer` 밖에 선언해야 우선순위 유지)
- shadcn 컴포넌트 설치 후 `@/` 경로 → 상대 경로 수동 수정 (`../../lib/utils`, `./Button` 등)
- `--color-accent` > `--color-popover` — 드롭다운 호버 가시성

## 반응형 작업 가이드 (`feat/taski-responsive`)

### 브레이크포인트 전략
Tailwind v4 기본 브레이크포인트 사용 (`md` = 768px 기준):
- **모바일** (`md` 미만): Sidebar 숨김 + 햄버거/드로어 패턴
- **데스크탑** (`md` 이상): 현재 레이아웃 유지 (Sidebar 고정 + 메인 콘텐츠)

### 컴포넌트별 반응형 작업 순서
| 순서 | 컴포넌트 | 작업 내용 |
|------|---------|---------|
| 1 | `page.tsx` + `Sidebar.tsx` | 모바일에서 Sidebar를 드로어로 전환 (Sheet 컴포넌트 활용) |
| 2 | `KanbanView.tsx` | 모바일: 가로 스크롤 유지 or 세로 스택 (결정 필요) |
| 3 | DnD TouchSensor | 모바일 터치 드래그 지원 추가 |
| 4 | 나머지 뷰 | SectionView, ChecklistView 패딩/폰트 미세 조정 |

### Sidebar 드로어 패턴 (구현 완료)
```tsx
// page.tsx — "use client" + sidebarOpen state
<div className="flex h-screen">
  {/* 데스크탑 전용 사이드바 */}
  <div className="hidden md:flex w-56">
    <Sidebar />
  </div>
  {/* 모바일 전용 드로어 */}
  <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
    <SheetContent side="left" className="p-0 w-64 sidebar-sheet">
      <SheetTitle className="sr-only">메뉴</SheetTitle>
      <Sidebar onClose={() => setSidebarOpen(false)} />
    </SheetContent>
  </Sheet>
  {/* 메인 콘텐츠 */}
  <main className="flex-1 ...">
    <header>
      {/* 모바일 전용 햄버거 버튼 */}
      <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
        <Menu size={32} />
      </button>
    </header>
  </main>
</div>
```

### Sidebar 컴포넌트 변경 사항
- `onClose?: () => void` prop 추가 — 카테고리 선택 시 모바일 Sheet 자동 닫힘
- `aside` 너비: `w-56` → `w-full` (너비는 부모 컨테이너가 제어)
  - 데스크탑: 래퍼 `div.w-56`이 너비 결정
  - 모바일: `SheetContent.w-64`가 너비 결정

### 설치된 shadcn 컴포넌트 (packages/ui)
- `Sheet` — 모바일 사이드바 드로어
- `Sidebar` — 미래 리팩터용 (현재 미사용)
- `Tooltip`, `Input`, `Skeleton`, `Separator` — Sidebar 컴포넌트 의존성

### 애니메이션 설정
- `tailwindcss-animate` 패키지 설치 + `globals.css`에 `@plugin "tailwindcss-animate"` 등록
- 사이드바 드로어: `globals.css`의 `.sidebar-sheet` 클래스로 easeOutElastic 커스텀 keyframe 적용
```css
@keyframes slide-in-elastic-left {
  0%   { transform: translateX(-100%); }
  55%  { transform: translateX(8px); }
  70%  { transform: translateX(-5px); }
  85%  { transform: translateX(2px); }
  100% { transform: translateX(0); }
}
```

### KanbanView 모바일 처리 (구현 완료)
- 가로 스크롤 방식 채택 — 칸반은 한눈에 보는 게 목적
- `KanbanColumn`: `flex-1 min-w-0` → `shrink-0 w-64 md:flex-1 md:min-w-[200px]`
  - 모바일: 컬럼 고정 256px → 4컬럼 합계 1024px → `overflow-x-auto`로 가로 스크롤
  - 데스크탑: `md:flex-1`으로 기존과 동일하게 가용 너비 균등 분할

### DnD TouchSensor 추가
```ts
// 모바일 터치 드래그 지원 — PointerSensor만으로는 iOS Safari에서 오작동 가능
import { TouchSensor } from "@dnd-kit/core"

const sensors = useSensors(
  useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } })
  // delay: 200ms — 스크롤과 드래그 의도 구분
)
```
**SectionView, KanbanView, ChecklistView 모두에 동일하게 적용.**

### AI 협업 시 블랙박스 방지 원칙
- 파일 하나씩 수정 — 여러 파일 동시 수정 요청 금지
- 코드 전에 접근 방식 설명 먼저 (`코드는 아직 쓰지 마` 명시)
- 변경 후 "왜 이 방식을 썼어?" 질문으로 이해 확인
- 모르는 Tailwind 클래스나 패턴은 즉시 질문

## 버그 수정 기록
| 증상 | 원인 | 수정 |
|------|------|------|
| 섹션/칸반 카테고리 신규 생성 시 툴바 미표시 | `filtered.length === 0` 얼리 리턴이 switch 전에 위치 | 빈 상태 처리를 checklist case 안으로 이동 |
| 칸반 모달 속성 버튼 변경 후 UI 미반영 | `task` prop이 스냅샷 — 스토어 변경을 반영 못함 | `liveTask` 패턴으로 Zustand 직접 구독 |
| 빈 칸반 컬럼으로 DnD 불가 | `setNodeRef`가 카드 목록 영역에만 있어 `closestCorners`가 타깃 감지 실패 | `setNodeRef` 컬럼 최상위 div로 이동 + `pointerWithin` 충돌 감지 사용 |
| Calendar hydration mismatch | `toLocaleDateString()` 서버(UTC)/클라이언트(로컬) 결과 불일치 | `"en-CA"` 로케일 고정 (`YYYY-MM-DD` 형식) |
| Calendar 스타일 미적용 | `react-day-picker/style.css` 미import로 레이아웃 CSS 누락 | `globals.css`에 import 추가 |
| Calendar 선택일이 원형으로 표시 | `react-day-picker/style.css`가 `@layer base`보다 우선순위 높아 border-radius 충돌 | `.rdp-*` 오버라이드를 `@layer` 밖에 선언 |

---

## AI 협업 원칙 (taski — 완성된 프로젝트)

taski는 구현이 완료된 상태다. 이 앱에서 AI의 역할은 코드 생성이 아니라
내가 이미 작성한 코드를 면접에서 설명할 수 있도록 돕는 것이다.

### 이 앱에서 AI가 할 것
- 내가 컴포넌트나 로직을 설명하면, 면접관처럼 "왜 이렇게 했어?" 라고 되물을 것
- "이 코드 설명해줘" 요청 시 설명해주지 말고, 내가 먼저 설명하게 유도할 것
- 내 설명에서 논리적으로 약한 부분이나 빠진 트레이드오프를 지적할 것
- 새 기능 추가 요청 시 전체 앱 원칙(위 섹션)을 따를 것

### 면접 대비 질문 예시 (요청 시 사용)
- "Zustand를 쓴 이유가 뭐야? Jotai나 Context API 대신 선택한 근거는?"
- "DnD 멀티컨테이너에서 onDragOver에 낙관적 업데이트를 넣은 이유가 뭐야?"
- "liveTask 패턴을 쓴 이유를 설명해봐. 다른 방법은 없었어?"
- "칸반 충돌 감지를 pointerWithin + closestCenter 조합으로 쓴 이유는?"
