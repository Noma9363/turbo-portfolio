"use client";

import { Task } from "@/store/taskStore";

interface KanbanViewProps {
    tasks: Task[];
}

// TODO: 칸반 레이아웃 구현 예정 (가로 컬럼 — SectionView와 데이터 동일)
export function KanbanView({ tasks: _ }: KanbanViewProps) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-sm">칸반 뷰 준비 중</p>
        </div>
    );
}
