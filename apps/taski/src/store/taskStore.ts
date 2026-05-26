import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Category = "업무" | "학습" | "루틴";

export interface Task {
  id: string;
  text: string;
  category: Category;
  completed: boolean;
  createdAt: number;
}

interface TaskStore {
  tasks: Task[];
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      activeCategory: "업무",

      setActiveCategory: (category) => set({ activeCategory: category }),

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
