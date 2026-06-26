"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@repo/ui";

interface SelectBlockProps {
    placeholder?: string;
    label?: string;
    value?: string;
    onValueChange: (value: string) => void;
    items: {
        value: string,
        name: string
    }[]

}

export function SelectBlock({ placeholder, label = "Category", value, onValueChange, items }: SelectBlockProps) {

    return (
        <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="w-full max-w-48">
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