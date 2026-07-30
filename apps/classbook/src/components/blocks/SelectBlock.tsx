"use client";

import { cn, Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@repo/ui";

interface SelectBlockProps {
    placeholder?: string;
    label?: string;
    value?: string;
    onValueChange: (value: string) => void;
    items: {
        value: string,
        name: string
    }[]
    className?: string;

}

export function SelectBlock({ placeholder, label = "Category", value, onValueChange, items, className }: SelectBlockProps) {

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn("w-full md:max-w-48", className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((i, idx) => (<SelectItem key={i.value + idx} value={i.value}>{i.name}</SelectItem>))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}