"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@repo/ui";
import { Sidebar } from "@/components/Sidebar";
import { TodoList } from "@/components/TodoList";
import { InputBar } from "@/components/InputBar";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* 데스크탑 전용 사이드바 */}
      <div className="hidden md:flex w-56">
        <Sidebar />
      </div>

      {/* 모바일 전용 드로어 */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64 sidebar-sheet">
          <SheetTitle className="sr-only">메뉴</SheetTitle>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* 메인 콘텐츠 */}
      <main className="flex flex-col flex-1 overflow-hidden">
        <header className="px-6 py-4 border-b border-border flex items-center gap-3">
          {/* 모바일 전용 햄버거 버튼 */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu size={32} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Welcome Back!</h1>
            <p className="text-xs text-muted-foreground mt-0.5">오늘도 하나씩 해내요</p>
          </div>
        </header>
        <TodoList />
        <InputBar />
      </main>
    </div>
  );
}
