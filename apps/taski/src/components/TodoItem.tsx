"use client";

import { GripVertical, Trash2 } from "lucide-react";
import { Button } from "@repo/ui";
import { Task, useTaskStore } from "@/store/taskStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TodoItemProps {
  task: Task;
}

export function TodoItem({ task }: TodoItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-muted transition-colors ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {/* 드래그 핸들 — 호버 시 노출 */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
        tabIndex={-1}
        aria-label="드래그하여 순서 변경"
      >
        <GripVertical size={14} />
      </button>

      {/* 체크박스 - 원형 커스텀 UI */}
      <button
        onClick={() => toggleTask(task.id)}
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
          task.completed
            ? "bg-primary border-primary"
            : "border-border hover:border-primary"
        }`}
      >
        {task.completed && (
          <svg
            className="w-3 h-3 text-primary-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 텍스트 */}
      <span
        className={`flex-1 text-sm transition-colors ${
          task.completed
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {task.text}
      </span>

      {/* 삭제 버튼 */}
      <Button
        variant="ghost"
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-muted-foreground hover:text-destructive-foreground"
      >
        <Trash2 size={14} />
      </Button>
    </li>
  );
}
