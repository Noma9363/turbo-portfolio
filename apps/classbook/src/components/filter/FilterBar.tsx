"use client";

import { Categories, CATEGORIES, CategorySelectBlockType } from "@/types/database";
import { SelectBlock } from "../blocks/SelectBlock";
import { PopoverFilterBlock } from "../blocks/PopoverFilterBlock";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface FilterBarProps{
    currentCategory?: Categories;
    view: 'grid'|'list';
    setView?: ()=>void;
}

export function FilterBar({currentCategory, view}:FilterBarProps){
    const router = useRouter();
    const searchParam = useSearchParams();

    const handlePrice = (minPrc: number, maxPrc: number)=>{
        const params = new URLSearchParams(searchParam.toString());
        if(minPrc) params.set("minPrc", String(minPrc));
        else params.delete("minPrc");
        if(maxPrc) params.set("maxPrc", String(maxPrc));
        else params.delete("maxPrc");
        router.push(`/venues?${params.toString()}`);
    }
    
    const handleCategory = (value: string) => {
        const params = new URLSearchParams(searchParam.toString());
        if(value === "ALL") params.delete("category");
        else params.set("category", value);
        router.push(`/venues?${params.toString()}`);
    }

    const categories:CategorySelectBlockType[] = [];  
    categories.push({ value: "ALL", name: "ALL"});
    CATEGORIES.map((c)=>{
        categories.push({value: c, name: c});
    })
    return(
        <div className="flex flex-row z-10 items-center gap-2 sticky top-14 bg-background/80 backdrop-blur-sm py-2">
            <SelectBlock
                placeholder="유형"
                label="선택"
                value={currentCategory}
                onValueChange={handleCategory}
                items={categories}
                className="flex-1 md:flex-none"
            />
            <PopoverFilterBlock onApply={handlePrice} triggerClassName="w-fit" />
        </div>
    )
}