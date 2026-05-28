"use client";

import { useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui";
import { Task, TaskPriority, TaskStatus, useTaskStore } from "@/store/taskStore";

// ─── 우선도 정의 ──────────────────────────────────────────────
const PRIORITY_OPTIONS: { value: TaskPriority; label: string; color: string }[] = [
    { value: 1,        label: "1",  color: "text-zinc-400"   },
    { value: 2,        label: "2",  color: "text-blue-400"   },
    { value: 3,        label: "3",  color: "text-yellow-400" },
    { value: 4,        label: "4",  color: "text-orange-400" },
    { value: 5,        label: "5",  color: "text-red-400"    },
    { value: "urgent", label: "급함", color: "text-red-500 font-bold" },
];

// 우선도 값 → 표시 색상 반환
const getPriorityColor = (priority?: TaskPriority): string => {
    if (!priority) return "text-muted-foreground";
    return PRIORITY_OPTIONS.find((o) => o.value === priority)?.color ?? "text-muted-foreground";
};

// ─── 섹션 정의 ────────────────────────────────────────────────
// 표시 순서와 레이블 — 순서 변경 시 이 배열만 수정
const SECTIONS: { status: TaskStatus; label: string }[] = [
    { status: "todo",        label: "할 일"  },
    { status: "in-progress", label: "진행 중" },
    { status: "done",        label: "완료"   },
];


// ─── Props ─────────────────────────────────────────────────────
interface SectionViewProps {
    tasks: Task[];
    // SectionTodoList에서 관리하는 선택 상태 — 체크박스 표시 및 토글에 사용
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
}

// ─── SectionView ───────────────────────────────────────────────
export function SectionView({ tasks, selectedIds, onToggleSelect }: SectionViewProps) {
    const { moveTask, deleteTask, setPriority } = useTaskStore();

    // 접힌 섹션을 Set으로 관리 — 각 섹션이 독립적으로 접기/펼치기 가능
    // boolean 3개 대신 Set 하나로 관리: 섹션 추가 시 state 수정 불필요
    const [collapsed, setCollapsed] = useState<Set<TaskStatus>>(new Set());

    const toggle = (status: TaskStatus) => {
        setCollapsed((prev) => {
            const next = new Set(prev);
            // 이미 접혀 있으면 펼치고, 펼쳐져 있으면 접기
            next.has(status) ? next.delete(status) : next.add(status);
            return next;
        });
    };

    return (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
            {SECTIONS.map(({ status, label }) => {
                const sectionTasks = tasks.filter((t) => t.status === status);
                const isCollapsed = collapsed.has(status);

                return (
                    <div key={status}>

                        {/* 섹션 헤더 — 클릭 시 접기/펼치기 */}
                        <button
                            onClick={() => toggle(status)}
                            className="w-full flex items-center gap-2 px-1 py-2 rounded-md hover:bg-muted transition-colors group/header"
                        >
                            {/* 화살표 아이콘 — 접힌 상태: →, 펼쳐진 상태: ↓ */}
                            <ChevronRight
                                size={14}
                                className={`text-muted-foreground transition-transform duration-200 ${
                                    isCollapsed ? "" : "rotate-90"
                                }`}
                            />
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                                {label}
                            </span>
                            {/* 태스크 개수 — 접혔을 때 더 유용하게 보임 */}
                            <span className="text-xs text-muted-foreground">
                                {sectionTasks.length}
                            </span>
                        </button>

                        {/* 섹션 콘텐츠 — isCollapsed이면 렌더하지 않음 */}
                        {!isCollapsed && (
                            <div className="mb-4">
                                {sectionTasks.length === 0 ? (
                                    <p className="text-xs text-muted-foreground px-7 py-2">—</p>
                                ) : (
                                    <ul className="flex flex-col gap-0.5">
                                        {sectionTasks.map((task) => (
                                            <li
                                                key={task.id}
                                                className="group flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
                                            >
                                                {/* 체크박스 — 선택 시 bulk 액션 대상에 포함 */}
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(task.id)}
                                                    onChange={() => onToggleSelect(task.id)}
                                                    className="shrink-0 w-3.5 h-3.5 accent-primary cursor-pointer opacity-100 group-hover:opacity-80 checked:opacity-100 transition-opacity"
                                                />

                                                {/* 우선도 드롭다운 — 클릭 시 1~5 / 급함 선택 */}
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className={`shrink-0 w-5 h-5 flex items-center justify-center text-xs font-medium rounded transition-colors hover:bg-muted cursor-pointer ${getPriorityColor(task.priority)}`}>
                                                            {/* 우선도 미설정: 대시 / 설정: 숫자 or 급 */}
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
                                                        {/* 우선도 해제 */}
                                                        <DropdownMenuItem
                                                            onClick={() => setPriority(task.id, undefined)}
                                                            className="text-muted-foreground"
                                                        >
                                                            해제
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                                {/* 텍스트 — done이면 취소선 */}
                                                <span className={`flex-1 text-sm transition-colors ${
                                                    status === "done"
                                                        ? "line-through text-muted-foreground"
                                                        : "text-foreground"
                                                }`}>
                                                    {task.text}
                                                </span>

                                                {/* 삭제 버튼 — 호버 시 노출 */}
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => deleteTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 h-7 w-7 p-0 text-muted-foreground hover:text-destructive-foreground"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
