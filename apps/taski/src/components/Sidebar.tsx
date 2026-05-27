"use client";

import { useState } from "react";
import { Plus, X, Check, MoreVertical } from "lucide-react";
import { Button } from "@repo/ui";
import { useTaskStore } from "@/store/taskStore";

export function Sidebar() {
  const { tasks, categories, activeCategory, setActiveCategory, addCategory, deleteCategory, editCategory } =
    useTaskStore();

  // 카테고리 추가 입력창 표시 여부
  const [isAdding, setIsAdding] = useState(false);

  // 현재 편집 중인 카테고리 이름 (null이면 편집 중 아님)
  // boolean 대신 string | null 을 사용해 어떤 카테고리를 편집 중인지 추적
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState("");
  const [inputEditValue, setInputEditValue] = useState("");

  // 미완료 항목만 카운트 (완료된 항목은 뱃지에서 제외)
  const countByCategory = (category: string) =>
    tasks.filter((t) => t.category === category && !t.completed).length;

  // ─── 카테고리 추가 ────────────────────────────────────────────
  const handleAddConfirm = () => {
    if (inputValue.trim()) {
      addCategory(inputValue);
    }
    setInputValue("");
    setIsAdding(false);
  };

  // Enter: 확인 / Escape: 입력 취소
  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAddConfirm();
    if (e.key === "Escape") {
      setInputValue("");
      setIsAdding(false);
    }
  };

  // ─── 카테고리 편집 ────────────────────────────────────────────
  // MoreVertical 클릭 시 호출
  // map 루프의 category 값을 editingCategory에 저장해 어떤 항목인지 기억
  const handleEditStart = (category: string) => {
    setEditingCategory(category);       // 어떤 카테고리를 편집할지 저장
    setInputEditValue(category);        // 기존 이름을 입력창에 미리 채워줌
  };

  // editingCategory(oldName) + inputEditValue(newName) 으로 스토어 액션 호출
  const handleEditConfirm = () => {
    if (inputEditValue.trim() && editingCategory) {
      editCategory(editingCategory, inputEditValue);
    }
    setInputEditValue("");
    setEditingCategory(null);           // 편집 종료
  };

  // Enter: 확인 / Escape: 편집 취소
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleEditConfirm();
    if (e.key === "Escape") {
      setInputEditValue("");
      setEditingCategory(null);
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

        // 현재 map의 category가 편집 중인 항목이면 인라인 입력창으로 교체
        if (editingCategory === category) {
          return (
            <div key={category} className="flex items-center gap-1 px-1">
              <input
                autoFocus
                type="text"
                value={inputEditValue}
                onChange={(e) => setInputEditValue(e.target.value)}
                onKeyDown={handleEditKeyDown}
                className="flex-1 bg-muted text-foreground text-sm px-2 py-1.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring min-w-0"
              />
              <Button
                variant="default"
                onClick={handleEditConfirm}
                className="shrink-0 h-7 w-7 p-0"
              >
                <Check size={12} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => { setInputEditValue(""); setEditingCategory(null); }}
                className="shrink-0 h-7 w-7 p-0 text-muted-foreground"
              >
                <X size={12} />
              </Button>
            </div>
          );
        }

        // 일반 상태 - 카테고리 탭 + 호버 시 편집 버튼 노출
        return (
          <div key={category} className="group relative flex items-center">
            <Button
              variant={isActive ? "default" : "ghost"}
              onClick={() => setActiveCategory(category)}
              // pr-8: 우측 편집 버튼 공간 확보
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

            {/* 편집 버튼 - 호버 시 노출, 클릭 시 해당 category를 편집 모드로 전환 */}
            <Button
              variant="ghost"
              onClick={() => handleEditStart(category)}
              className="absolute right-1 opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground"
            >
              <MoreVertical size={12} />
            </Button>
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
            onKeyDown={handleAddKeyDown}
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
