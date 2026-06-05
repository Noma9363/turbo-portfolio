"use client";

import { Button, ButtonGroup, ButtonGroupSeparator } from "@repo/ui";
import { Plus } from "lucide-react";
import { TaskStatus } from "@/store/taskStore";

interface SectionAddInputProps {
    selectedIds: string[];
    onBulkDelete: () => void;
    onBulkMove: (status: TaskStatus) => void;
}

export function SectionAddInput({ selectedIds, onBulkDelete, onBulkMove }: SectionAddInputProps) {
    // 선택된 항목이 있을 때만 bulk 액션 버튼 활성화
    const hasSelection = selectedIds.length > 0;

    return (
        <div className="w-full px-4 py-2 flex justify-between items-center border-b border-border">

            {/* 일정 추가 */}
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                <Plus size={12} />
                일정 추가
            </Button>

            {/* 상태 변경 + 선택 삭제 — 선택된 항목이 있을 때만 활성 */}
            <div className="flex items-center gap-2">
                <ButtonGroup>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!hasSelection}
                        onClick={() => onBulkMove("todo")}
                    >
                        할 일
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!hasSelection}
                        onClick={() => onBulkMove("in-progress")}
                    >
                        진행 중
                    </Button>
                    <ButtonGroupSeparator />
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!hasSelection}
                        onClick={() => onBulkMove("canceled")}
                    >
                        취소
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={!hasSelection}
                        onClick={() => onBulkMove("done")}
                    >
                        완료
                    </Button>
                </ButtonGroup>

                <Button
                    size="sm"
                    variant="outline"
                    disabled={!hasSelection}
                    onClick={onBulkDelete}
                    className="text-red-500 hover:text-red-500 disabled:text-muted-foreground"
                >
                    삭제
                </Button>
            </div>
        </div>
    );
}
