"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, Tag, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { Task, TaskPriority, TaskStatus, useTaskStore } from "@/store/taskStore";

// ─── 상수 ─────────────────────────────────────────────────────

const STATUS_CONFIG: Record<TaskStatus, { label: string; dot: string }> = {
  "todo":        { label: "할 일",  dot: "bg-zinc-500"  },
  "in-progress": { label: "진행 중", dot: "bg-blue-500"  },
  "done":        { label: "완료",   dot: "bg-green-500" },
  "canceled":    { label: "취소됨", dot: "bg-red-400"   },
};

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 1,        label: "1 — 낮음",  color: "text-zinc-400"         },
  { value: 2,        label: "2",         color: "text-blue-400"         },
  { value: 3,        label: "3",         color: "text-yellow-400"       },
  { value: 4,        label: "4",         color: "text-orange-400"       },
  { value: 5,        label: "5 — 높음",  color: "text-red-400"          },
  { value: "urgent", label: "급함",      color: "text-red-500 font-bold" },
];

// ─── 속성 버튼 ────────────────────────────────────────────────

function PriorityButton({ task }: { task: Task }) {
  const { setPriority } = useTaskStore();
  const current = PRIORITY_OPTIONS.find((o) => o.value === task.priority);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted transition-colors ${current?.color ?? "text-muted-foreground"}`}>
          <span className="font-medium">
            {task.priority === undefined ? "우선도" : task.priority === "urgent" ? "급함" : `P${task.priority}`}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {PRIORITY_OPTIONS.map(({ value, label, color }) => (
          <DropdownMenuItem
            key={String(value)}
            onClick={() => setPriority(task.id, value)}
            className={`${color} ${task.priority === value ? "bg-accent" : ""}`}
          >
            {label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem onClick={() => setPriority(task.id, undefined)} className="text-muted-foreground">
          해제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StatusButton({ task }: { task: Task }) {
  const { moveTask } = useTaskStore();
  const config = STATUS_CONFIG[task.status];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted transition-colors text-muted-foreground">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          {config.label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-32">
        {(Object.entries(STATUS_CONFIG) as [TaskStatus, typeof STATUS_CONFIG[TaskStatus]][]).map(([status, { label, dot }]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => moveTask(task.id, status)}
            className={task.status === status ? "bg-accent" : ""}
          >
            <span className={`w-2 h-2 rounded-full ${dot} mr-2`} />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DueDateButton({ task, onChange }: { task: Task; onChange: (date: number | undefined) => void }) {
  const selected = task.dueDate ? new Date(task.dueDate) : undefined;
  const formatted = selected
    ? selected.toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
    : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted transition-colors text-muted-foreground">
          <CalendarIcon size={12} />
          {formatted ?? "마감일"}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => onChange(date ? date.getTime() : undefined)}
          className="rounded-lg border border-border"
        />
        {selected && (
          <div className="border-t border-border px-3 py-2">
            <button
              onClick={() => onChange(undefined)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              마감일 제거
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function AssigneeButton({ task, onChange }: { task: Task; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(task.assignee ?? "");

  useEffect(() => { setVal(task.assignee ?? ""); }, [task.assignee]);

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={() => { onChange(val); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") { onChange(val); setEditing(false); } }}
        placeholder="담당자"
        className="px-2.5 py-1.5 rounded-md text-xs border border-border bg-muted text-foreground focus:outline-none w-24"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted transition-colors text-muted-foreground"
    >
      <User size={12} />
      {task.assignee ?? "담당자"}
    </button>
  );
}

function LabelsButton({ task, onChange }: { task: Task; onChange: (labels: string[]) => void }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(task.labels?.join(", ") ?? "");

  useEffect(() => { setVal(task.labels?.join(", ") ?? ""); }, [task.labels]);

  const commit = () => {
    const next = val.split(",").map((s) => s.trim()).filter(Boolean);
    onChange(next);
    setEditing(false);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") commit(); }}
        placeholder="bug, feature"
        className="px-2.5 py-1.5 rounded-md text-xs border border-border bg-muted text-foreground focus:outline-none w-36"
      />
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border border-border hover:bg-muted transition-colors text-muted-foreground"
    >
      <Tag size={12} />
      {task.labels?.length ? task.labels.join(", ") : "레이블"}
    </button>
  );
}

// ─── KanbanDetailModal ────────────────────────────────────────

interface KanbanDetailModalProps {
  task: Task | null;
  onClose: () => void;
}

export function KanbanDetailModal({ task, onClose }: KanbanDetailModalProps) {
  const { updateTask } = useTaskStore();
  const liveTask = useTaskStore((state) => state.tasks.find((t) => t.id === task?.id));

  const [title,   setTitle]   = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!liveTask) return;
    setTitle(liveTask.title ?? "");
    setSummary(liveTask.summary ?? "");
    setContent(liveTask.content ?? "");
  }, [liveTask?.id]);

  if (!liveTask) return null;

  const save = (patch: Parameters<typeof updateTask>[1]) => updateTask(liveTask.id, patch);

  return (
    <Dialog open={!!task} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">

        <DialogTitle className="sr-only">{liveTask.title ?? liveTask.text}</DialogTitle>

        {/* 헤더 — 상태 표시 */}
        <div className="flex items-center px-6 py-3">
          <StatusButton task={liveTask} />
        </div>

        {/* 본문 */}
        <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto max-h-[70vh]">

          {/* 제목 */}
          <textarea
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => save({ title })}
            placeholder={liveTask.text}
            rows={1}
            className="w-full resize-none bg-transparent text-xl font-semibold text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-snug"
            style={{ overflow: "hidden" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = el.scrollHeight + "px";
            }}
          />

          {/* 요약 */}
          <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              onBlur={() => save({ summary })}
              placeholder="Add a short summary..."
              rows={1}
              className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none leading-relaxed"
          />

          {/* 속성 버튼 바 */}
          <div className="flex flex-wrap items-center gap-2">
            <PriorityButton task={liveTask} />
            <DueDateButton task={liveTask} onChange={(dueDate) => save({ dueDate })} />
            <AssigneeButton task={liveTask} onChange={(assignee) => save({ assignee })} />
            <LabelsButton task={liveTask} onChange={(labels) => save({ labels })} />
          </div>

          {/* 구분선 */}
          <div className="border-t border-border" />

          {/* 본문 */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => save({ content })}
            placeholder="Add description..."
            rows={6}
            className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none leading-relaxed"
          />
        </div>

        {/* 푸터 */}
        <div className="px-6 py-3 border-t border-border flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
