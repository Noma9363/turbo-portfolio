import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── 타입 정의 ────────────────────────────────────────────────

// 카테고리 타입: UI 렌더링 방식 결정
// checklist: 완료/미완료 토글
// section: todo/in-progress/done 세로 섹션
// kanban: todo/in-progress/done 가로 컬럼 (section과 데이터 동일, 레이아웃만 다름)
export type CategoryType = "checklist" | "section" | "kanban";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
}

// 프로젝트형 전용 진행 상태
export type TaskStatus = "todo" | "in-progress" | "done" | "canceled";

// 태스크 우선도 — 숫자 1(낮음)~5(높음) + "urgent"(급함)
export type TaskPriority = 1 | 2 | 3 | 4 | 5 | "urgent";

export interface Task {
  id: string;
  text: string;
  categoryId: string;  // Category.id 참조 (이름 대신 id — 이름 변경에 영향 없음)
  completed: boolean;  // checklist 타입용: 완료 여부
  status: TaskStatus;  // project 타입용: 진행 단계 (기본값 "todo")
  priority?: TaskPriority; // 우선도 — 미설정 시 undefined (선택 항목)
  createdAt: number;

  // 칸반 상세 필드 (선택)
  title?: string;       // 제목 — text와 별도 (text는 기존 뷰에서 그대로 사용)
  summary?: string;     // 짧은 설명
  content?: string;     // 본문
  dueDate?: number;     // 마감일 (timestamp)
  assignee?: string;    // 담당자
  labels?: string[];    // 레이블 태그 배열
}

// ─── 기본 카테고리 ────────────────────────────────────────────
// UUID 대신 고정 id 사용 — localStorage 초기화 시 매번 다른 id 생성 방지
const DEFAULT_CATEGORIES: Category[] = [
  { id: "default-portfolio", name: "포트폴리오",  type: "section"    },
  { id: "default-work",      name: "업무",        type: "checklist"  },
  { id: "default-study",     name: "학습",        type: "checklist"  },
  { id: "default-routine",   name: "루틴",        type: "checklist"  },
];

// 섹션 뷰 데모가 첫 화면에 보이도록 포트폴리오 카테고리를 기본 활성화
const DEFAULT_ACTIVE_ID = "default-portfolio";

// ─── 기본 태스크 (데모용) ─────────────────────────────────────
// 고정 id — localStorage 초기화 시 중복 생성 방지
const DEFAULT_TASKS: Task[] = [
  // ── 포트폴리오 / section ──────────────────────────────────
  // todo
  { id: "task-p1", text: "반응형 레이아웃 최적화",       categoryId: "default-portfolio", completed: false, status: "todo",        priority: 3,        createdAt: 1 },
  { id: "task-p2", text: "Contact 섹션 이메일 연동",     categoryId: "default-portfolio", completed: false, status: "todo",        priority: 4,        createdAt: 2 },
  { id: "task-p3", text: "다크 모드 색상 변수 정리",     categoryId: "default-portfolio", completed: false, status: "todo",        priority: 2,        createdAt: 3 },
  // in-progress
  { id: "task-p4", text: "taski 앱 Vercel 배포",        categoryId: "default-portfolio", completed: false, status: "in-progress", priority: "urgent", createdAt: 4 },
  { id: "task-p5", text: "포트폴리오 README 작성",       categoryId: "default-portfolio", completed: false, status: "in-progress", priority: 3,        createdAt: 5 },
  // done
  { id: "task-p6", text: "드래그앤드롭 구현",            categoryId: "default-portfolio", completed: true,  status: "done",        priority: 4,        createdAt: 6 },
  { id: "task-p7", text: "카테고리 타입 시스템 구현",    categoryId: "default-portfolio", completed: true,  status: "done",        priority: 3,        createdAt: 7 },
  { id: "task-p8", text: "Zustand 스토어 설계",          categoryId: "default-portfolio", completed: true,  status: "done",        priority: 2,        createdAt: 8 },

  // ── 업무 / checklist ─────────────────────────────────────
  { id: "task-w1", text: "주간 보고서 작성",             categoryId: "default-work",      completed: false, status: "todo",                            createdAt: 9  },
  { id: "task-w2", text: "코드 리뷰 진행",               categoryId: "default-work",      completed: true,  status: "done",                            createdAt: 10 },

  // ── 학습 / checklist ─────────────────────────────────────
  { id: "task-s1", text: "TypeScript 제네릭 복습",       categoryId: "default-study",     completed: false, status: "todo",                            createdAt: 11 },
  { id: "task-s2", text: "@dnd-kit 공식 문서 읽기",      categoryId: "default-study",     completed: true,  status: "done",                            createdAt: 12 },

  // ── 루틴 / checklist ─────────────────────────────────────
  { id: "task-r1", text: "운동 30분",                   categoryId: "default-routine",   completed: false, status: "todo",                            createdAt: 13 },
  { id: "task-r2", text: "독서 20분",                   categoryId: "default-routine",   completed: false, status: "todo",                            createdAt: 14 },
];

// ─── 스토어 인터페이스 ────────────────────────────────────────

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  activeCategory: string; // 현재 선택된 Category.id

  // 카테고리 액션
  setActiveCategory: (id: string) => void;
  addCategory: (name: string, type: CategoryType) => void;
  deleteCategory: (id: string) => void;
  editCategory: (id: string, newName: string) => void;

  // 할 일 액션 (공통)
  // status: 생략 시 "todo" 기본값 — checklist는 생략, section/kanban은 섹션별 status 전달
  addTask: (text: string, status?: TaskStatus) => void;
  deleteTask: (id: string) => void;

  // 체크리스트 전용: 완료 ↔ 미완료 토글
  toggleTask: (id: string) => void;

  // 프로젝트 전용: todo → in-progress → done 이동
  moveTask: (id: string, status: TaskStatus) => void;

  // 우선도 설정 — section/kanban 타입에서 사용
  setPriority: (id: string, priority: TaskPriority | undefined) => void;

  // 상세 필드 업데이트 — 칸반 상세 뷰에서 사용
  updateTask: (id: string, patch: Partial<Pick<Task, "title" | "summary" | "content" | "dueDate" | "assignee" | "labels">>) => void;

  // 순서 변경 — DnD로 activeId를 overId 위치로 이동
  reorderTasks: (activeId: string, overId: string) => void;
}

// ─── 스토어 ──────────────────────────────────────────────────

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: DEFAULT_TASKS,
      categories: DEFAULT_CATEGORIES,
      activeCategory: DEFAULT_ACTIVE_ID,

      // ── 카테고리 ──────────────────────────────────────────

      setActiveCategory: (id) => set({ activeCategory: id }),

      addCategory: (name, type) => {
        const { categories } = get();
        const trimmed = name.trim();
        // 빈 문자열 및 동일 이름의 카테고리 중복 방지
        if (!trimmed || categories.some((c) => c.name === trimmed)) return;
        const newCategory: Category = {
          id: crypto.randomUUID(),
          name: trimmed,
          type, // "checklist" | "section" | "kanban"
        };
        set({ categories: [...categories, newCategory] });
      },

      deleteCategory: (id) => {
        const { categories, activeCategory, tasks } = get();
        // 카테고리가 1개뿐이면 삭제 불가
        if (categories.length <= 1) return;
        const next = categories.filter((c) => c.id !== id);
        set({
          categories: next,
          // 삭제된 카테고리가 현재 활성이면 첫 번째로 이동
          // next[0]은 카테고리가 2개 이상일 때만 삭제 가능하므로 항상 존재
          activeCategory: activeCategory === id ? next[0]!.id : activeCategory,
          // 해당 카테고리에 속한 할 일도 함께 삭제
          tasks: tasks.filter((t) => t.categoryId !== id),
        });
      },

      editCategory: (id, newName) => {
        const { categories } = get();
        const trimmed = newName.trim();
        // 빈 문자열 또는 이미 존재하는 이름으로 변경 방지
        if (!trimmed || categories.some((c) => c.name === trimmed)) return;
        set({
          // id가 일치하는 카테고리의 name만 교체, 나머지(id, type)는 유지
          categories: categories.map((c) =>
            c.id === id ? { ...c, name: trimmed } : c
          ),
          // tasks는 categoryId(id) 기반 참조라 이름 변경에 영향 없음 — 수정 불필요
        });
      },

      // ── 할 일 (공통) ──────────────────────────────────────

      addTask: (text, status = "todo") => {
        const { activeCategory, tasks } = get();
        const newTask: Task = {
          id: crypto.randomUUID(),
          text: text.trim(),
          categoryId: activeCategory,
          completed: false,
          // status 미전달 시 "todo" 기본값
          // checklist: 항상 "todo" (completed로 관리)
          // section/kanban: 섹션별 status 전달
          status,
          createdAt: Date.now(),
        };
        set({ tasks: [...tasks, newTask] });
      },

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),

      // ── 체크리스트 전용 ───────────────────────────────────

      // completed를 토글하면서 status도 동기화
      // → 다른 뷰에서 참조할 때 일관성 유지
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  status: !t.completed ? "done" : "todo",
                }
              : t
          ),
        })),

      // ── 우선도 ────────────────────────────────────────────────

      // undefined 전달 시 우선도 해제
      setPriority: (id, priority) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, priority } : t
          ),
        })),

      // ── 프로젝트 전용 ─────────────────────────────────────

      // status를 변경하면서 completed도 동기화
      // → done이면 completed: true, 그 외엔 false
      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  completed: status === "done" || status === "canceled",
                }
              : t
          ),
        })),

      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),

      // ── DnD 순서 변경 ─────────────────────────────────────
      // flat 배열에서 activeId를 overId 위치로 splice
      // 각 뷰는 status로 필터링하므로 배열 내 상대 순서가 표시 순서가 됨
      reorderTasks: (activeId, overId) =>
        set((state) => {
          const items = [...state.tasks];
          const oldIndex = items.findIndex((t) => t.id === activeId);
          const newIndex = items.findIndex((t) => t.id === overId);
          if (oldIndex === -1 || newIndex === -1) return {};
          // splice로 oldIndex 제거 후 newIndex에 삽입
          items.splice(newIndex, 0, items.splice(oldIndex, 1)[0]!);
          return { tasks: items };
        }),
    }),
    {
      name: "taski-storage",
      // version 3: 데모 기본 데이터 추가 — 구 버전 localStorage는 자동 폐기
      version: 3,
    }
  )
);
