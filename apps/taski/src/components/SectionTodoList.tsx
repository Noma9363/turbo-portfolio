"use client";

import { useState } from "react";
import { Task, TaskStatus, useTaskStore } from "@/store/taskStore";
import { SectionAddInput } from "./SectionAddInput";
import { SectionView } from "./SectionView";

interface SectionTodoListProps {
    tasks: Task[];
}

export function SectionTodoList({ tasks }: SectionTodoListProps) {
    const { deleteTask, moveTask } = useTaskStore();

    // 선택된 task id 목록 — SectionAddInput과 SectionView가 공유
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    // 개별 선택 토글 — 이미 있으면 제거, 없으면 추가
    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const clearSelection = () => setSelectedIds([]);

    // 선택된 항목 전체 삭제
    const handleBulkDelete = () => {
        selectedIds.forEach((id) => deleteTask(id));
        clearSelection();
    };

    // 선택된 항목 전체 상태 변경
    const handleBulkMove = (status: TaskStatus) => {
        selectedIds.forEach((id) => moveTask(id, status));
        clearSelection();
    };

    return (
        <>
            {/* 툴바 — 선택 상태와 bulk 액션 콜백 전달 */}
            <SectionAddInput
                selectedIds={selectedIds}
                onBulkDelete={handleBulkDelete}
                onBulkMove={handleBulkMove}
            />
            {/* 섹션 리스트 — 선택 상태와 토글 콜백 전달 */}
            <SectionView
                tasks={tasks}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
            />
        </>
    );
}
