"use client";

import { useTaskStore } from "@/store/taskStore";
import { TodoItem } from "./TodoItem";

export function TodoList() {
  const { tasks, activeCategory } = useTaskStore();

  const filtered = tasks.filter((t) => t.category === activeCategory);
  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  if (filtered.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          할 일을 추가해보세요 ✏️
        </p>
      </div>
    );
  }

  return (
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
  );
}
