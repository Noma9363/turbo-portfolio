"use client";

import { Trash2 } from "lucide-react";
import { Task, useTaskStore } from "@/store/taskStore";

interface TodoItemProps {
  task: Task;
}

export function TodoItem({ task }: TodoItemProps) {
  const { toggleTask, deleteTask } = useTaskStore();

  return (
    <li className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors">
      {/* 체크박스 */}
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
      <button
        onClick={() => deleteTask(task.id)}
        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive-foreground transition-all cursor-pointer p-1 rounded"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}
