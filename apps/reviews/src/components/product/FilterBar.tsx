"use client"

import Link from "next/link";
import { categories, CATEGORIES } from "@/types/database";
import { Button } from "@repo/ui";

interface FilterBarProps {
    currentCategory?: categories;
}

export function FilterBar({ currentCategory }: FilterBarProps) {
    return (
        <div className="flex flex-row gap-1.5 overflow-x-auto">
            <Button
                asChild
                variant={
                    !currentCategory ? "default" : "outline"
                }
                size="sm"
                className={!currentCategory ? "" : "bg-zinc-900"}
            >
                <Link href="/reviews">All</Link>
            </Button>
            {CATEGORIES.map((category) => (
                <Button
                    key={category}
                    asChild
                    variant={
                        currentCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    className={currentCategory === category ? "" : "bg-zinc-900"}
                >
                    <Link href={`/reviews?category=${category}`}>{category}</Link>
                </Button>
            ))}
        </div>
    )
}
