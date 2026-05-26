"use client";

import { Category, useTaskStore } from "@/store/taskStore";

const CATEGORIES: Category[] = ["업무", "학습", "루틴"];

const CATEGORY_ICONS: Record<Category, string> = {
  업무: "💼",
  학습: "📚",
  루틴: "🔁",
};

export function Sidebar() {
  const { tasks, activeCategory, setActiveCategory } = useTaskStore();

  const countByCategory = (category: Category) =>
    tasks.filter((t) => t.category === category && !t.completed).length;

  return (
    <aside className="w-56 shrink-0 border-r border-border flex flex-col gap-1 p-4">
      <p className="text-xs text-muted-foreground font-medium px-3 mb-2 uppercase tracking-widest">
        카테고리
      </p>
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category;
        const count = countByCategory(category);

        return (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{CATEGORY_ICONS[category]}</span>
              <span>{category}</span>
            </span>
            {count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}
