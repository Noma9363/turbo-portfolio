"use client";

import { useState } from "react";
import { Trash2, ChevronRight } from "lucide-react";
import { Button } from "@repo/ui";
import { Task, TaskStatus, useTaskStore } from "@/store/taskStore";

// ─── 섹션 정의 ────────────────────────────────────────────────
// 표시 순서와 레이블 — 순서 변경 시 이 배열만 수정
const SECTIONS: { status: TaskStatus; label: string }[] = [
    { status: "todo",        label: "할 일"  },
    { status: "in-progress", label: "진행 중" },
    { status: "done",        label: "완료"   },
];

// 현재 status의 다음 단계 반환 (done → todo로 순환)
const nextStatus = (current: TaskStatus): TaskStatus => {
    if (current === "todo")        return "in-progress";
    if (current === "in-progress") return "done";
    return "todo";
};

// ─── Props ─────────────────────────────────────────────────────
interface SectionViewProps {
    tasks: Task[];
}

// ─── SectionView ───────────────────────────────────────────────
export function SectionView({ tasks }: SectionViewProps) {
    const { moveTask, deleteTask } = useTaskStore();

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
                                                {/* 상태 인디케이터 — 클릭 시 nextStatus로 이동 */}
                                                {/* todo: 빈 원 / in-progress: 반 채워진 원 / done: 체크 원 */}
                                                <button
                                                    onClick={() => moveTask(task.id, nextStatus(task.status))}
                                                    className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer ${
                                                        status === "done"
                                                            ? "bg-primary border-primary"
                                                            : status === "in-progress"
                                                            ? "border-primary"
                                                            : "border-border hover:border-primary"
                                                    }`}
                                                >
                                                    {status === "done" && (
                                                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                    {status === "in-progress" && (
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                    )}
                                                </button>

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
