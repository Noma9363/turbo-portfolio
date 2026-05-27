"use client";

import { useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import { Button } from "@repo/ui";
import { useTaskStore } from "@/store/taskStore";

export function Sidebar() {
  const { tasks, categories, activeCategory, setActiveCategory, addCategory, deleteCategory } =
    useTaskStore();

  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 미완료 항목만 카운트 (완료된 항목은 뱃지에서 제외)
  const countByCategory = (category: string) =>
    tasks.filter((t) => t.category === category && !t.completed).length;

  const handleAddConfirm = () => {
    if (inputValue.trim()) {
      addCategory(inputValue);
    }
    setInputValue("");
    setIsAdding(false);
  };

  // Enter: 확인 / Escape: 입력 취소
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
            <Button
              variant={isActive ? "default" : "ghost"}
              onClick={() => setActiveCategory(category)}
              // pr-8: 우측 삭제 버튼 공간 확보
              className="w-full justify-between text-sm font-normal pr-8 h-auto py-2"
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
            </Button>

            {/* 삭제 버튼 - 카테고리가 2개 이상일 때만 표시 */}
            {categories.length > 1 && (
              <Button
                variant="ghost"
                onClick={() => deleteCategory(category)}
                className="absolute right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground hover:text-destructive-foreground"
              >
                <Trash2 size={12} />
              </Button>
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
          <Button
            variant="default"
            onClick={handleAddConfirm}
            className="shrink-0 h-7 w-7 p-0"
          >
            <Check size={12} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => { setInputValue(""); setIsAdding(false); }}
            className="shrink-0 h-7 w-7 p-0 text-muted-foreground"
          >
            <X size={12} />
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="justify-start gap-2 text-sm text-muted-foreground mt-1 h-auto py-2"
        >
          <Plus size={14} />
          <span>카테고리 추가</span>
        </Button>
      )}
    </aside>
  );
}
