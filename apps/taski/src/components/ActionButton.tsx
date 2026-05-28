import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    cn
} from "@repo/ui";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ActionButtonProps {
    onEdit: () => void;
    onDelete: () => void;
    // 활성 상태에 따라 아이콘 색상을 부모에서 제어
    className?: string;
}

export function ActionButton({ onEdit, onDelete, className }: ActionButtonProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "absolute right-1 opacity-0 group-hover/category:opacity-100 hover:opacity-100 data-[state=open]:opacity-100 h-6 w-6 p-0 hover:bg-transparent",
                        className
                    )}
                >
                    <MoreVertical size={12} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={onEdit}>
                    <Pencil size={14} />
                    이름 변경
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-500 focus:text-red-500"
                >
                    <Trash2 size={14} />
                    삭제
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
