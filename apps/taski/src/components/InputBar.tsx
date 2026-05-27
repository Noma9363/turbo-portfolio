"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";

export function InputBar() {
  const [value, setValue] = useState("");
  const { addTask, activeCategory } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 빈 문자열 제출 방지
    if (!value.trim()) return;
    addTask(value);
    setValue("");
  };

  return (
    <div className="border-t border-border p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`${activeCategory} 할 일 추가...`}
          className="flex-1 bg-muted text-foreground text-sm px-4 py-2.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-shadow"
        />
        <button
          type="submit"
          disabled={!value.trim()}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
