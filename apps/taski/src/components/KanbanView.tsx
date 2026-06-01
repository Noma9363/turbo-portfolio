"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui";
import { Task, TaskPriority, TaskStatus, useTaskStore } from "@/store/taskStore";
import { KanbanAddModal } from "@/components/KanbanAddModal";
import { KanbanDetailModal } from "@/components/KanbanDetailModal";

// ─── 우선도 (SectionView와 동일 정의) ────────────────────────
const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
  { value: 1,        label: "1",   color: "text-zinc-400"         },
  { value: 2,        label: "2",   color: "text-blue-400"         },
  { value: 3,        label: "3",   color: "text-yellow-400"       },
  { value: 4,        label: "4",   color: "text-orange-400"       },
  { value: 5,        label: "5",   color: "text-red-400"          },
  { value: "urgent", label: "급함", color: "text-red-500 font-bold" },
];

const getPriorityColor = (priority?: TaskPriority): string => {
  if (!priority) return "text-muted-foreground";
  return PRIORITY_OPTIONS.find((o) => o.value === priority)?.color ?? "text-muted-foreground";
};

// ─── 컬럼 정의 ────────────────────────────────────────────────
const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo",        label: "할 일"  },
  { status: "in-progress", label: "진행 중" },
  { status: "done",        label: "완료"   },
  { status: "canceled", label: "취소됨" }
];

const COLUMN_STATUSES = COLUMNS.map((c) => c.status);

// ─── 정렬 가능한 칸반 카드 ────────────────────────────────────
function KanbanCard({ task, onOpenDetail }: { task: Task; onOpenDetail: (task: Task) => void }) {
  const { deleteTask, setPriority } = useTaskStore();

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
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onOpenDetail(task)}
      className={`group p-3 rounded-lg bg-muted border border-border hover:border-zinc-600 transition-colors cursor-pointer ${
        isDragging ? "opacity-40" : task.status === "canceled" ? "opacity-50" : ""
      }`}
    >
      {/* 카드 헤더 — 드래그 핸들 + 우선도 + 삭제 */}
      <div className="flex items-center gap-1 mb-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
          tabIndex={-1}
          aria-label="드래그하여 이동"
        >
          <GripVertical size={12} />
        </button>

        {/* 우선도 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`w-5 h-5 flex items-center justify-center text-xs font-medium rounded transition-colors hover:bg-background cursor-pointer ${getPriorityColor(task.priority)}`}
            >
              {task.priority === undefined
                ? "—"
                : task.priority === "urgent"
                ? "급"
                : task.priority}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-24">
            {PRIORITY_OPTIONS.map(({ value, label, color }) => (
              <DropdownMenuItem
                key={String(value)}
                onClick={() => setPriority(task.id, value)}
                className={`${color} ${task.priority === value ? "bg-accent" : ""}`}
              >
                {label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem
              onClick={() => setPriority(task.id, undefined)}
              className="text-muted-foreground"
            >
              해제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {/* 삭제 버튼 */}
        <Button
          variant="ghost"
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-muted-foreground hover:text-destructive-foreground"
        >
          <Trash2 size={12} />
        </Button>
      </div>

      {/* 카드 텍스트 */}
      <p
        className={`text-sm leading-snug ${
          task.status === "done" || task.status === "canceled"
            ? "line-through text-muted-foreground"
            : "text-foreground"
        }`}
      >
        {task.text}
      </p>
    </div>
  );
}

// ─── 드롭 가능한 칸반 컬럼 ───────────────────────────────────
interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  onAdd: (status: TaskStatus) => void;
  onOpenDetail: (task: Task) => void;
}

function KanbanColumn({ status, label, tasks, onAdd, onOpenDetail }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div ref={setNodeRef} className="flex flex-col flex-1 min-w-0">
      {/* 컬럼 헤더 */}
      <div className="flex items-center gap-2 px-1 py-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">{tasks.length}</span>
      </div>

      {/* 컬럼별 + 버튼 */}
      <button
        onClick={() => onAdd(status)}
        className="mb-3 flex items-center gap-1 px-1 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors w-full"
      >
        <Plus size={12} />
        추가
      </button>

      {/* 카드 목록 */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 flex-1 min-h-[60px]">
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onOpenDetail={onOpenDetail} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── KanbanView ───────────────────────────────────────────────
export function KanbanView({ tasks }: { tasks: Task[] }) {
  const { moveTask, reorderTasks } = useTaskStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalStatus, setModalStatus] = useState<TaskStatus | null>(null);
  const [detailTask, setDetailTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // ── DnD 핸들러 (SectionView와 동일 패턴) ─────────────────

  const handleDragStart = (event: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === event.active.id) ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId   = String(over.id);

    const draggingTask = tasks.find((t) => t.id === activeId);
    if (!draggingTask) return;

    const overStatus: TaskStatus | undefined = COLUMN_STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    if (overStatus && draggingTask.status !== overStatus) {
      moveTask(activeId, overStatus);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;

    const activeId = String(active.id);
    const overId   = String(over.id);

    if (COLUMN_STATUSES.includes(overId as TaskStatus)) return;

    const updatedActiveTask = tasks.find((t) => t.id === activeId);
    const overTask          = tasks.find((t) => t.id === overId);
    if (updatedActiveTask && overTask && updatedActiveTask.status === overTask.status) {
      reorderTasks(activeId, overId);
    }
  };

  return (
    <div className={activeTask ? "select-none" : undefined}>
      {/* 상단 툴바 — 새 태스크(todo) 추가 */}
      <div className="px-4 py-2 border-b border-border">
        <button
          onClick={() => setModalStatus("todo")}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Plus size={12} />
          일정 추가
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={(args) => {
          const over = pointerWithin(args);
          return over.length ? over : closestCenter(args);
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* 컬럼 가로 레이아웃 */}
        <div className="flex-1 overflow-hidden px-4 py-4">
          <div className="h-full flex gap-4 overflow-x-auto">
            {COLUMNS.map(({ status, label }) => (
              <KanbanColumn
                key={status}
                status={status}
                label={label}
                tasks={tasks.filter((t) => t.status === status)}
                onAdd={setModalStatus}
                onOpenDetail={setDetailTask}
              />
            ))}
          </div>
        </div>

        {/* 드래그 오버레이 */}
        <DragOverlay>
          {activeTask && (
            <div className="p-3 rounded-lg bg-card border border-border shadow-xl opacity-95 w-56">
              <p className="text-sm text-foreground">{activeTask.text}</p>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* 태스크 추가 모달 */}
      <KanbanAddModal
        open={modalStatus !== null}
        defaultStatus={modalStatus ?? "todo"}
        onClose={() => setModalStatus(null)}
      />

      {/* 태스크 상세 모달 */}
      <KanbanDetailModal
        task={detailTask}
        onClose={() => setDetailTask(null)}
      />
    </div>
  );
}
