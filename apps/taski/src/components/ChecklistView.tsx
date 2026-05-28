"use client";

import {TodoItem} from "@/components/TodoItem";
import {Task} from "@/store/taskStore";

interface ChecklistViewProps {
    pending: Task[]; // 진행중인 목록 (필터처리)
    completed: Task[]; // 완료한 목록 (필터처리)
}

export function ChecklistView({
                                  pending, completed,
                              }: ChecklistViewProps) {
    return (<ul className="flex-1 overflow-y-auto px-2 py-2 flex flex-col gap-0.5">
        {pending.map((task) => (<TodoItem key={task.id} task={task}/>))}

        {completed.length > 0 && (<>
            <li className="px-4 pt-4 pb-1">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              완료 {completed.length}
            </span>
            </li>
            {completed.map((task) => (<TodoItem key={task.id} task={task}/>))}
        </>)}
    </ul>)
}