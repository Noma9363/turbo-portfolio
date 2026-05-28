"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@repo/ui";
import { Check, X, CheckSquare, AlignLeft, LayoutGrid } from "lucide-react";
import { CategoryType } from "@/store/taskStore";

// ─── 타입 선택 목록 ────────────────────────────────────────────
// 타입 추가 시 이 배열만 수정하면 UI 자동 반영
const CATEGORY_TYPES: { type: CategoryType; label: string; icon: React.ReactNode }[] = [
    { type: "checklist", label: "체크",  icon: <CheckSquare size={12} /> },
    { type: "section",   label: "섹션",  icon: <AlignLeft   size={12} /> },
    { type: "kanban",    label: "칸반",  icon: <LayoutGrid  size={12} /> },
];

// ─── Props ─────────────────────────────────────────────────────
interface CategoryAddInputProps {
    inputValue: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    // onConfirm: 확인 시 선택된 타입을 부모(Sidebar)로 전달
    // → 부모에서 addCategory(name, type) 호출
    onConfirm: (type: CategoryType) => void;
    onCancel: () => void;
}

export function CategoryAddInput({ inputValue, onChange, onConfirm, onCancel }: CategoryAddInputProps) {
    // 선택된 카테고리 타입 — 기본값 "checklist"
    // 이 state는 타입 선택 책임이 이 컴포넌트에 있으므로 내부에서 관리
    const [selectedType, setSelectedType] = useState<CategoryType>("checklist");

    // Enter: 현재 선택된 타입으로 확인 / Escape: 취소
    // onKeyDown을 prop으로 받지 않는 이유:
    // selectedType이 내부 state라 부모에서 접근할 수 없기 때문
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") onConfirm(selectedType);
        if (e.key === "Escape") onCancel();
    };

    return (
        <div className="flex flex-col gap-2 px-1 mt-1">

            {/* 카테고리 이름 입력 */}
            <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={onChange}
                onKeyDown={handleKeyDown}
                placeholder="카테고리 이름"
                className="bg-muted text-foreground text-sm px-2 py-1.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
            />

            {/* 타입 선택 — 3개 버튼 균등 분할 */}
            {/* selectedType과 일치하는 버튼만 활성 스타일 적용 */}
            <div className="grid grid-cols-3 gap-1">
                {CATEGORY_TYPES.map(({ type, label, icon }) => (
                    <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs transition-colors ${
                            selectedType === type
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {icon}
                        {label}
                    </button>
                ))}
            </div>

            {/* 취소 / 확인 버튼 — flex-1으로 동일 가로 비율, outline 스타일 */}
            <div className="flex gap-1">
                <Button variant="outline" onClick={onCancel} className="flex-1 h-7 p-0 text-muted-foreground">
                    <X size={12} />
                </Button>
                <Button variant="outline" onClick={() => onConfirm(selectedType)} className="flex-1 h-7 p-0">
                    <Check size={12} />
                </Button>
            </div>
        </div>
    );
}
