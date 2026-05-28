"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { Task, useTaskStore } from "@/store/taskStore";
import { TodoItem } from "@/components/TodoItem";

interface ChecklistViewProps {
  pending: Task[];
  completed: Task[];
}

export function ChecklistView({ pending, completed }: ChecklistViewProps) {
  const { reorderTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // 5px 이동 후 드래그 시작 — 체크박스 클릭과 드래그 구분
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const allTasks = [...pending, ...completed];

  const handleDragStart = (event: DragStartEvent) => {
    const task = allTasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;
    reorderTasks(String(active.id), String(over.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={allTasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <ul className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
          {pending.map((task) => (
            <TodoItem key={task.id} task={task} />
          ))}

          {completed.length > 0 && (
            <>
              <li className="px-4 pt-4 pb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  완료 {completed.length}
                </span>
              </li>
              {completed.map((task) => (
                <TodoItem key={task.id} task={task} />
              ))}
            </>
          )}
        </ul>
      </SortableContext>

      {/* 드래그 중 커서를 따라다니는 오버레이 — TodoItem은 SortableContext 밖에서 렌더 불가 */}
      <DragOverlay>
        {activeTask && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-card border border-border shadow-xl opacity-95">
            <GripVertical size={14} className="text-muted-foreground" />
            <span className="text-sm text-foreground">{activeTask.text}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
