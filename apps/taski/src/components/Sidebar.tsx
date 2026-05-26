"use client";

import { useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";

export function Sidebar() {
  const { tasks, categories, activeCategory, setActiveCategory, addCategory, deleteCategory } =
    useTaskStore();

  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const countByCategory = (category: string) =>
    tasks.filter((t) => t.category === category && !t.completed).length;

  const handleAddConfirm = () => {
    if (inputValue.trim()) {
      addCategory(inputValue);
    }
    setInputValue("");
    setIsAdding(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddConfirm();
    if (e.key === "Escape") {
      setInputValue("");
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-56 shrink-0 border-r border-border flex flex-col gap-1 p-4">
      <p className="text-xs text-muted-foreground font-medium px-3 mb-2 uppercase tracking-widest">
        카테고리
      </p>

      {categories.map((category) => {
        const isActive = activeCategory === category;
        const count = countByCategory(category);

        return (
          <div key={category} className="group relative flex items-center">
            <button
              onClick={() => setActiveCategory(category)}
              className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer pr-8 ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>{category}</span>
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

            {/* 삭제 버튼 - 카테고리가 2개 이상일 때만 표시 */}
            {categories.length > 1 && (
              <button
                onClick={() => deleteCategory(category)}
                className="absolute right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive-foreground transition-all cursor-pointer p-0.5 rounded"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        );
      })}

      {/* 카테고리 추가 입력창 */}
      {isAdding ? (
        <div className="flex items-center gap-1 px-1 mt-1">
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="카테고리 이름"
            className="flex-1 bg-muted text-foreground text-sm px-2 py-1.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring min-w-0"
          />
          <button
            onClick={handleAddConfirm}
            className="shrink-0 p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 cursor-pointer"
          >
            <Check size={12} />
          </button>
          <button
            onClick={() => { setInputValue(""); setIsAdding(false); }}
            className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer mt-1"
        >
          <Plus size={14} />
          <span>카테고리 추가</span>
        </button>
      )}
    </aside>
  );
}
