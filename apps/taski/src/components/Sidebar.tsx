"use client";

import {useState} from "react";
import {Plus} from "lucide-react";
import {Button} from "@repo/ui";
import {useTaskStore, CategoryType} from "@/store/taskStore";
import {ActionButton} from "@/components/ActionButton";
import {SideBarEditInput} from "@/components/SidebarEditInput";
import {CategoryAddInput} from "@/components/CategoryAddInput";

export function Sidebar({ onClose }: { onClose?: () => void }) {
    const {
        tasks, categories, activeCategory, setActiveCategory, addCategory, deleteCategory, editCategory
    } = useTaskStore();

    // 카테고리 추가 입력창 표시 여부
    const [isAdding, setIsAdding] = useState(false);

    // 현재 편집 중인 카테고리 id (null이면 편집 중 아님)
    // boolean 대신 string | null 을 사용해 어떤 카테고리를 편집 중인지 추적
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const [inputValue, setInputValue] = useState("");
    const [inputEditValue, setInputEditValue] = useState("");

    // 미완료 항목만 카운트 (완료된 항목은 뱃지에서 제외)
    // categoryId 기준으로 필터링 (category 이름이 아닌 id)
    const countByCategory = (id: string) => tasks.filter((t) => t.categoryId === id && !t.completed).length;

    // ─── 카테고리 추가 ────────────────────────────────────────────
    // CategoryAddInput에서 선택된 type을 받아 스토어에 전달
    // Enter/Escape 처리는 CategoryAddInput 내부에서 담당
    const handleAddConfirm = (type: CategoryType) => {
        if (inputValue.trim()) {
            addCategory(inputValue, type);
        }
        setInputValue("");
        setIsAdding(false);
    };

    // ─── 카테고리 편집 ────────────────────────────────────────────
    // MoreVertical 클릭 시 호출
    // category.id를 editingCategoryId에 저장해 어떤 항목인지 기억
    const handleEditStart = (id: string, name: string) => {
        setEditingCategoryId(id);       // 어떤 카테고리를 편집할지 id로 저장
        setInputEditValue(name);        // 기존 이름을 입력창에 미리 채워줌
    };

    // editingCategoryId(id) + inputEditValue(newName) 으로 스토어 액션 호출
    const handleEditConfirm = () => {
        if (inputEditValue.trim() && editingCategoryId) {
            editCategory(editingCategoryId, inputEditValue);
        }
        setInputEditValue("");
        setEditingCategoryId(null);     // 편집 종료
    };

    // Enter: 확인 / Escape: 편집 취소
    const handleEditKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleEditConfirm();
        if (e.key === "Escape") {
            setInputEditValue("");
            setEditingCategoryId(null);
        }
    };

    return (<aside className="w-full shrink-0 border-r border-border flex flex-col gap-1 p-4">
        <p className="text-xs text-muted-foreground font-medium px-3 mb-3 uppercase tracking-widest">
            카테고리
        </p>

        {categories.map((category) => {
            const isActive = activeCategory === category.id;
            const count = countByCategory(category.id);

            // 현재 map의 category가 편집 중인 항목이면 인라인 입력창으로 교체
            if (editingCategoryId === category.id) {
                return (<SideBarEditInput
                    key={category.id}
                    inputEditValue={inputEditValue}
                    onChange={(e) => setInputEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onConfirm={handleEditConfirm}
                    onCancel={() => {
                        setInputEditValue("");
                        setEditingCategoryId(null);
                    }}
                />);
            }

            // 일반 상태 - 카테고리 탭 + 호버 시 편집 버튼 노출
            return (<div key={category.id} className="group/category relative flex items-center">
                <Button
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => { setActiveCategory(category.id); onClose?.(); }}
                    // pr-8: 우측 편집 버튼 공간 확보
                    className="w-full justify-between text-sm font-normal pr-8 h-auto py-2"
                >
                    <span>{category.name}</span>
                    {count > 0 && (<span
                        className={`text-xs aspect-square min-w-[1.25rem] flex items-center justify-center rounded-full ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                    >
                  {count}
                </span>)}
                </Button>

                {/* 편집 버튼 - 호버 시 노출, 클릭 시 해당 category를 편집 모드로 전환 */}
                {/* 활성 시 배경이 흰색이므로 아이콘도 어두운 색으로, 비활성 시 muted 색 */}
                <ActionButton
                    onEdit={() => handleEditStart(category.id, category.name)}
                    onDelete={() => deleteCategory(category.id)}
                    className={isActive ? "text-primary-foreground/60 hover:text-primary-foreground" : "text-muted-foreground hover:text-foreground"}
                />
            </div>);
        })}

        {/* 카테고리 추가 입력창 */}
        {isAdding ? (<CategoryAddInput
            inputValue={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onConfirm={handleAddConfirm}
            onCancel={() => { setInputValue(""); setIsAdding(false); }}
        />) : (<Button
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="justify-start gap-2 text-sm text-muted-foreground mt-1 h-auto py-2"
        >
            <Plus size={14}/>
            <span>카테고리 추가</span>
        </Button>)}
    </aside>);
}
