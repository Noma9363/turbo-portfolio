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
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  text: string;
  categoryId: string;  // Category.id 참조 (이름 대신 id — 이름 변경에 영향 없음)
  completed: boolean;  // checklist 타입용: 완료 여부
  status: TaskStatus;  // project 타입용: 진행 단계 (기본값 "todo")
  createdAt: number;
}

// ─── 기본 카테고리 ────────────────────────────────────────────
// UUID 대신 고정 id 사용 — localStorage 초기화 시 매번 다른 id 생성 방지
const DEFAULT_CATEGORIES: Category[] = [
  { id: "default-work", name: "업무", type: "checklist" },
  { id: "default-study", name: "학습", type: "checklist" },
  { id: "default-routine", name: "루틴", type: "checklist" },
];

// TypeScript: DEFAULT_CATEGORIES[0]은 항상 존재하므로 상수로 분리
const DEFAULT_ACTIVE_ID = "default-work";

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
}

// ─── 스토어 ──────────────────────────────────────────────────

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
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
                  completed: status === "done",
                }
              : t
          ),
        })),
    }),
    {
      name: "taski-storage",
      // version 추가: 기존 localStorage 데이터(구 string[] 형식)와 충돌 방지
      // version이 다르면 저장된 데이터를 버리고 초기값으로 시작
      version: 2,
    }
  )
);
