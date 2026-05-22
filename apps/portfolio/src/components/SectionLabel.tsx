import type { ReactNode } from "react";
import {cn} from "@repo/ui";

interface SectionLabelProps {
    children: ReactNode;
    className?: string;
}

export function SectionLabel({children, className}: SectionLabelProps) {

    return (
        <p
            className={cn("text-xs font-medium tracking-widest uppercase text-muted-foreground mb-4 border-b pb-2 ", className)}>
            {children}
        </p>
    );
}