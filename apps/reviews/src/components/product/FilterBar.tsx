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
        <div>
            <Button
                onClick={() => {
                    router.push(`/reviews`)
                }}
                variant={
                    !currentCategory ? "default" : "outline"
                }
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
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
