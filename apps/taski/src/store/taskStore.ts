import { create } from "zustand";
import { persist } from "zustand/middleware";

// 카테고리는 사용자가 자유롭게 추가/삭제할 수 있어 string 타입으로 관리
export type Category = string;

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  categories: Category[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  addCategory: (name: string) => void;
  deleteCategory: (name: string) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  // persist: 상태를 localStorage에 자동 저장 → 새로고침해도 데이터 유지
  persist(
    (set, get) => ({
      tasks: [],
      categories: ["업무", "학습", "루틴"],
      activeCategory: "업무",

      setActiveCategory: (category) => set({ activeCategory: category }),

      addCategory: (name) => {
        const { categories } = get();
        const trimmed = name.trim();
        // 빈 문자열 및 중복 이름 방지
        if (!trimmed || categories.includes(trimmed)) return;
        set({ categories: [...categories, trimmed] });
      },

      deleteCategory: (name) => {
        const { categories, activeCategory, tasks } = get();
        // 카테고리가 1개만 남은 경우 삭제 불가
        if (categories.length <= 1) return;
        const next = categories.filter((c) => c !== name);
        set({
          categories: next,
          // 삭제된 카테고리가 활성화된 경우 첫 번째 카테고리로 이동
          activeCategory: activeCategory === name ? next[0] : activeCategory,
          // 해당 카테고리의 할 일도 함께 삭제
          tasks: tasks.filter((t) => t.category !== name),
        });
      },

      addTask: (text) => {
        const { activeCategory, tasks } = get();
        const newTask: Task = {
          id: crypto.randomUUID(),
          text: text.trim(),
          category: activeCategory,
          completed: false,
          createdAt: Date.now(),
        };
        set({ tasks: [...tasks, newTask] });
      },

      // 완료 상태를 토글 (완료 → 미완료, 미완료 → 완료)
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      // localStorage 저장 키
      name: "taski-storage",
    }
  )
);
