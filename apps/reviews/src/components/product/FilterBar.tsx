"use client"

import { useRouter } from "next/navigation";
import { categories, CATEGORIES } from "@/types/database";
import { Button } from "@repo/ui";

interface FilterBarProps {
    currentCategory?: categories;
}

export function FilterBar({ currentCategory }: FilterBarProps) {
    const router = useRouter();

    return (
        <div className="flex flex-row gap-1.5 overflow-x-auto">
            <Button
                onClick={() => {
                    router.push(`/reviews`)
                }}
                variant={
                    !currentCategory ? "default" : "outline"
                }
                size="sm"
                className={!currentCategory ? "" : "bg-zinc-900"}
            >
                All
            </Button>
            {CATEGORIES.map((category) => (
                <Button
                    key={category}
                    onClick={() => {
                        router.push(`/reviews?category=${category}`)
                    }}
                    variant={
                        currentCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    className={currentCategory === category ? "" : "bg-zinc-900"}
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
