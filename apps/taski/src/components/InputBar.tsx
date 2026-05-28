"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@repo/ui";
import { useTaskStore } from "@/store/taskStore";

export function InputBar() {
  const [value, setValue] = useState("");
  const { addTask, activeCategory, categories } = useTaskStore();

  // activeCategory는 id — placeholder에 표시할 이름을 categories에서 찾아옴
  const activeName = categories.find((c) => c.id === activeCategory)?.name ?? "";

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
          placeholder={`${activeName} 할 일 추가...`}
          className="flex-1 bg-muted text-foreground text-sm px-4 py-2.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring transition-shadow"
        />
        <Button
          type="submit"
          variant="default"
          disabled={!value.trim()}
          className="shrink-0 h-9 w-9 p-0"
        >
          <Plus size={18} />
        </Button>
      </form>
    </div>
  );
}
