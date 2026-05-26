import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  persist(
    (set, get) => ({
      tasks: [],
      categories: ["업무", "학습", "루틴"],
      activeCategory: "업무",

      setActiveCategory: (category) => set({ activeCategory: category }),

      addCategory: (name) => {
        const { categories } = get();
        const trimmed = name.trim();
        if (!trimmed || categories.includes(trimmed)) return;
        set({ categories: [...categories, trimmed] });
      },

      deleteCategory: (name) => {
        const { categories, activeCategory, tasks } = get();
        if (categories.length <= 1) return; // 최소 1개 유지
        const next = categories.filter((c) => c !== name);
        set({
          categories: next,
          // 삭제된 카테고리가 활성화된 경우 첫 번째로 이동
          activeCategory: activeCategory === name ? next[0] : activeCategory,
          // 해당 카테고리 할 일은 함께 삭제
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
      name: "taski-storage",
    }
  )
);
