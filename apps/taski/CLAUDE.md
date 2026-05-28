# taski

## 앱 개요
Turborepo 모노레포(`turbo-portfolio`) 내 `apps/taski` 에 위치한 일정 관리 투두리스트 앱.
Next.js 15 + Tailwind CSS v4 + Zustand 기반의 다크 미니멀 테마.

## 기술 스택
- **프레임워크**: Next.js 15 (App Router), React 19
- **스타일**: Tailwind CSS v4 (`@tailwindcss/postcss`)
- **상태 관리**: Zustand v5 (`persist` 미들웨어로 localStorage 자동 저장)
- **공유 컴포넌트**: `@repo/ui` (Button, DropdownMenu 등 — shadcn 기반)
- **언어**: TypeScript 5
- **포트**: `localhost:3001`

## 프로젝트 구조
```
apps/taski/
├── next.config.ts          # transpilePackages: ['@repo/ui']
├── postcss.config.mjs      # @tailwindcss/postcss
├── tsconfig.json           # @repo/typescript-config/nextjs.json 상속
└── src/
    ├── app/
    │   ├── layout.tsx          # 루트 레이아웃 (Geist + Noto Sans KR)
    │   ├── page.tsx            # 진입점 — Sidebar + TodoList + InputBar 조합
    │   └── globals.css         # Tailwind v4 + 다크 테마 변수 (@theme)
    ├── components/
    │   ├── Sidebar.tsx         # 카테고리 탭 목록, 추가/편집/삭제 UI
    │   ├── SidebarEditInput.tsx # 카테고리 인라인 편집 입력창 (분리된 컴포넌트)
    │   ├── SidebarItem.tsx     # 카테고리 탭 단일 아이템
    │   ├── ActionButton.tsx    # MoreVertical → DropdownMenu (이름 변경 / 삭제)
    │   ├── TodoList.tsx        # 카테고리 필터링 + 완료/미완료 섹션 분리
    │   ├── TodoItem.tsx        # 할 일 단일 아이템 (체크박스 + 삭제)
    │   └── InputBar.tsx        # 하단 고정 할 일 입력바
    └── store/
        └── taskStore.ts        # Zustand 스토어 (persist)
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

### 상태
| 상태 | 타입 | 설명 |
|------|------|------|
| `tasks` | `Task[]` | 전체 할 일 목록 |
| `categories` | `string[]` | 카테고리 목록 (기본: 업무/학습/루틴) |
| `activeCategory` | `string` | 현재 선택된 카테고리 |

### 액션
| 액션 | 설명 |
|------|------|
| `setActiveCategory` | 카테고리 탭 전환 |
| `addCategory(name)` | 카테고리 추가 (중복/빈 값 방지) |
| `deleteCategory(name)` | 카테고리 삭제 + 해당 할 일 함께 삭제, 최소 1개 유지 |
| `editCategory(oldName, newName)` | 카테고리 이름 변경 + 연결된 tasks category 동기화 |
| `addTask(text)` | 현재 활성 카테고리로 할 일 추가 |
| `toggleTask(id)` | 완료 ↔ 미완료 토글 |
| `deleteTask(id)` | 할 일 삭제 |

### localStorage
`persist` 미들웨어로 `taski-storage` 키에 자동 저장. 새로고침해도 데이터 유지.

## 컬러 테마 (`globals.css @theme`)
| 변수 | 값 | 용도 |
|------|----|------|
| `--color-background` | `#09090b` | 앱 배경 |
| `--color-foreground` | `#fafafa` | 기본 텍스트 |
| `--color-card` | `#0f0f11` | 카드 배경 |
| `--color-muted` | `#18181b` | 입력창, 호버 배경 |
| `--color-muted-foreground` | `#71717a` | 보조 텍스트 |
| `--color-border` | `#27272a` | 구분선 |
| `--color-accent` | `#27272a` | 드롭다운 아이템 호버 (popover보다 밝게 설정) |
| `--color-popover` | `#18181b` | 드롭다운 배경 |

## 중요 설정
- `next.config.ts`: `transpilePackages: ['@repo/ui']` — 모노레포 UI 패키지 직접 컴파일
- `globals.css`: `@source "../../../../packages/ui/src/**/*.{ts,tsx}"` — packages/ui 클래스 스캔
- `--color-accent` 은 `--color-popover` 보다 밝아야 드롭다운 아이템 호버가 보임

## 컴포넌트 패턴

### 카테고리 편집 흐름
```
MoreVertical(ActionButton) 클릭 → "이름 변경" 선택
  → handleEditStart(category)
    → setEditingCategory(category)   // 어떤 카테고리인지 저장
    → setInputEditValue(category)    // 기존 이름 입력창에 미리 채움
  → map 순회 시 editingCategory === category 인 항목 → SidebarEditInput 렌더
  → handleEditConfirm()
    → editCategory(editingCategory, inputEditValue)  // oldName, newName
    → setEditingCategory(null)       // 편집 종료
```

### group/category 패턴 (Tailwind v4 named group)
```tsx
// 부모 - named group 선언
<div className="group/category relative flex items-center">

// 자식(ActionButton 내부) - named group-hover 사용
<Button className="opacity-0 group-hover/category:opacity-100 hover:opacity-100 data-[state=open]:opacity-100">
```
- Tailwind v4에서 중첩 그룹 충돌 방지를 위해 named group 사용
- `hover:opacity-100` — 버튼 자체에 직접 호버 시에도 유지
- `data-[state=open]:opacity-100` — 드롭다운 열린 동안 포털로 마우스 이동해도 유지

### ActionButton 색상 제어
활성 카테고리(흰 배경)와 비활성(다크 배경)에서 아이콘 색상이 달라야 하므로
`className` prop으로 부모(Sidebar)에서 색상 주입:
```tsx
<ActionButton
  onEdit={() => handleEditStart(category)}
  onDelete={() => deleteCategory(category)}
  className={isActive
    ? "text-primary-foreground/60 hover:text-primary-foreground"
    : "text-muted-foreground hover:text-foreground"
  }
/>
```

### ActionButton 구조 (shadcn 미니멀 스타일)
```tsx
<DropdownMenuContent align="end" className="w-36">
  <DropdownMenuItem onClick={onEdit}>이름 변경</DropdownMenuItem>
  <DropdownMenuItem onClick={onDelete} className="text-red-500 focus:text-red-500">
    삭제
  </DropdownMenuItem>
</DropdownMenuContent>
```
- `align="end"` — 트리거 오른쪽 기준 정렬
- 삭제 항목 `text-red-500` — 위험 액션 시각적 구분
- Separator 없음 — 항목 2개로 불필요

### editCategory 스토어 로직
```ts
editCategory: (oldName, newName) => {
  // categories 배열: oldName과 일치하는 항목만 newName으로 교체
  categories: categories.map((c) => c === oldName ? trimmed : c),
  // tasks 배열: category 속성이 oldName인 항목의 category만 교체
  // ...t 로 나머지 속성(id, text, completed 등)은 그대로 유지
  tasks: tasks.map((t) => t.category === oldName ? { ...t, category: trimmed } : t),
}
```
