"use client";

import { useTaskStore } from "@/store/taskStore";
import {SectionView} from "@/components/SectionView";
import {KanbanView} from "@/components/KanbanView";
import {ChecklistView} from "@/components/ChecklistView";

export function TodoList() {
  const { tasks, activeCategory, categories } = useTaskStore();

  // 현재 선택된 카테고리 기준으로 필터링 후 완료/미완료 분리
  // activeCategory는 Category.id — category 이름이 아닌 id로 비교
  const filtered = tasks.filter((t) => t.categoryId === activeCategory);
  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  // 카테고리 분기
  const currentCategory = categories.find(c => c.id === activeCategory); // 활성화된 카테고리의 타입 추출

  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          할 일을 추가해보세요 ✏️
        </p>
      </div>
    );
  }

  // 타입에 따라 컴포넌트 렌더
  switch (currentCategory?.type){
    case "section": return <SectionView tasks={filtered} />
    case "kanban" : return <KanbanView tasks={filtered} />
    default: return <ChecklistView pending={pending} completed={completed} />
  }
}
