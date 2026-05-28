"use client";

import {Button} from "@repo/ui";
import {Check, X} from "lucide-react";

interface SideBarEditInputProps {
    inputEditValue: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

export function SideBarEditInput({
                                     inputEditValue, onChange, onKeyDown, onConfirm, onCancel
                            }: SideBarEditInputProps) {
    return (<div className="flex items-center gap-1">
        <input
            autoFocus
            type="text"
            value={inputEditValue}
            onChange={onChange}
            onKeyDown={onKeyDown}
            className="flex-1 bg-muted text-foreground text-sm px-2 py-1.5 rounded-lg outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring min-w-0"
        />
        <Button
            variant="default"
            onClick={onConfirm}
            className="shrink-0 h-7 w-7 p-0"
        >
            <Check size={12}/>
        </Button>
        <Button
            variant="ghost"
            onClick={onCancel}
            className="shrink-0 h-7 w-7 p-0 text-muted-foreground"
        >
            <X size={12}/>
        </Button>
    </div>)
}
