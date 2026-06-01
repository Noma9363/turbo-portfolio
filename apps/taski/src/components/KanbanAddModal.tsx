"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
} from "@repo/ui";
import { TaskStatus, useTaskStore } from "@/store/taskStore";

const STATUS_LABEL: Record<TaskStatus, string> = {
  "todo":        "할 일",
  "in-progress": "진행 중",
  "done":        "완료",
  "canceled":    "취소됨",
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  "todo":        "bg-zinc-500",
  "in-progress": "bg-blue-500",
  "done":        "bg-green-500",
  "canceled":    "bg-red-400",
};

interface KanbanAddModalProps {
  open: boolean;
  defaultStatus: TaskStatus;
  onClose: () => void;
}

export function KanbanAddModal({ open, defaultStatus, onClose }: KanbanAddModalProps) {
  const { addTask } = useTaskStore();
  const [text, setText] = useState("");

  const handleConfirm = () => {
    if (!text.trim()) return;
    addTask(text.trim(), defaultStatus);
    setText("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") { setText(""); onClose(); }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) { setText(""); onClose(); }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-medium">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[defaultStatus]}`} />
            {STATUS_LABEL[defaultStatus]} 추가
          </DialogTitle>
        </DialogHeader>

        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="제목"
          className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
        />

        <DialogFooter>
          <Button variant="ghost" size="sm" onClick={() => { setText(""); onClose(); }}>
            취소
          </Button>
          <Button size="sm" onClick={handleConfirm} disabled={!text.trim()}>
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
