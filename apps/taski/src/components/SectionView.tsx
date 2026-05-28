"use client";

import { useState } from "react";
import { ChevronRight, GripVertical, Trash2 } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
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

// ─── 우선도 정의 ──────────────────────────────────────────────
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

// ─── 섹션 정의 ────────────────────────────────────────────────
const SECTIONS: { status: TaskStatus; label: string }[] = [
  { status: "todo",        label: "할 일"  },
  { status: "in-progress", label: "진행 중" },
  { status: "done",        label: "완료"   },
];

const SECTION_STATUSES = SECTIONS.map((s) => s.status);

// ─── 정렬 가능한 섹션 아이템 ──────────────────────────────────
interface SortableSectionItemProps {
  task: Task;
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

function SortableSectionItem({ task, selectedIds, onToggleSelect }: SortableSectionItemProps) {
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
    <li
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 px-2 py-3 rounded-lg hover:bg-muted transition-colors ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {/* 드래그 핸들 */}
      <button
        {...attributes}
        {...listeners}
        className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
        tabIndex={-1}
        aria-label="드래그하여 이동"
      >
        <GripVertical size={14} />
      </button>

      {/* 체크박스 — bulk 액션 대상 선택 */}
      <input
        type="checkbox"
        checked={selectedIds.includes(task.id)}
        onChange={() => onToggleSelect(task.id)}
        className="shrink-0 w-3.5 h-3.5 accent-primary cursor-pointer transition-opacity"
      />

      {/* 우선도 드롭다운 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium rounded transition-colors hover:bg-muted cursor-pointer ${getPriorityColor(task.priority)}`}
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

      {/* 텍스트 */}
      <span
        className={`flex-1 text-sm transition-colors ${
          task.status === "done"
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

// ─── 드롭 가능한 섹션 컨테이너 ─────────────────────────────────
// 섹션이 비어 있어도 드롭 타깃으로 인식하기 위해 useDroppable 사용
function DroppableSection({ status, children }: { status: TaskStatus; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className="min-h-[32px]">
      {children}
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────
interface SectionViewProps {
  tasks: Task[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
}

// ─── SectionView ───────────────────────────────────────────────
export function SectionView({ tasks, selectedIds, onToggleSelect }: SectionViewProps) {
  const { moveTask, reorderTasks } = useTaskStore();
  const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set());
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const toggle = (status: TaskStatus) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(status) ? next.delete(status) : next.add(status);
      return next;
    });
  };

  // ── DnD 핸들러 ────────────────────────────────────────────

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

    // overId가 섹션 status인지 태스크 id인지 판별
    const overStatus: TaskStatus | undefined = SECTION_STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status;

    // 다른 섹션으로 넘어갔으면 즉시 status 변경 (낙관적 업데이트)
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

    // 섹션 컨테이너 위에서 끝난 경우 — onDragOver에서 이미 status 변경 완료
    if (SECTION_STATUSES.includes(overId as TaskStatus)) return;

    // 같은 섹션 내 reorder — onDragOver에서 status가 이미 동기화된 상태
    const updatedActiveTask = tasks.find((t) => t.id === activeId);
    const overTask          = tasks.find((t) => t.id === overId);
    if (updatedActiveTask && overTask && updatedActiveTask.status === overTask.status) {
      reorderTasks(activeId, overId);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
        {SECTIONS.map(({ status, label }) => {
          const sectionTasks = tasks.filter((t) => t.status === status);
          const isCollapsed  = collapsed.has(status);

          return (
            <div key={status}>
              {/* 섹션 헤더 */}
              <button
                onClick={() => toggle(status)}
                className="w-full flex items-center gap-2 px-1 py-2 rounded-md hover:bg-muted transition-colors"
              >
                <ChevronRight
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${
                    isCollapsed ? "" : "rotate-90"
                  }`}
                />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  {label}
                </span>
                <span className="text-xs text-muted-foreground">{sectionTasks.length}</span>
              </button>

              {!isCollapsed && (
                <div className="mb-4">
                  <SortableContext
                    items={sectionTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {/* 빈 섹션도 드롭 타깃이 되도록 useDroppable 적용 */}
                    <DroppableSection status={status}>
                      {sectionTasks.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-7 py-2">—</p>
                      ) : (
                        <ul className="flex flex-col gap-0.5">
                          {sectionTasks.map((task) => (
                            <SortableSectionItem
                              key={task.id}
                              task={task}
                              selectedIds={selectedIds}
                              onToggleSelect={onToggleSelect}
                            />
                          ))}
                        </ul>
                      )}
                    </DroppableSection>
                  </SortableContext>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 드래그 오버레이 — SortableContext 밖이므로 useSortable 없는 간단한 div */}
      <DragOverlay>
        {activeTask && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-card border border-border shadow-xl opacity-95">
            <GripVertical size={14} className="text-muted-foreground" />
            <span className="text-sm text-foreground">{activeTask.text}</span>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
