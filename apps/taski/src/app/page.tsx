import { Sidebar } from "@/components/Sidebar";
import { TodoList } from "@/components/TodoList";
import { InputBar } from "@/components/InputBar";

export default function Page() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex flex-col flex-1 overflow-hidden">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="text-lg font-semibold text-foreground">Welcome Back!</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            오늘도 하나씩 해내요
          </p>
        </header>
        <TodoList />
        <InputBar />
      </main>
    </div>
  );
}
