import { cn } from "@repo/ui";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[1276px] mx-auto px-6 md:px-8",
        className
      )}
    >
      {children}
    </div>
  );
}
