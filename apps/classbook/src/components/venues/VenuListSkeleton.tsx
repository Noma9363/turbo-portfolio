"use client";

import { useState } from "react";
import { Button } from "@repo/ui";
import { Grid, List } from "lucide-react";
import { VenueCardSkeleton } from "./VenueCardSkeleton";


export function VenueListSkeleton(){
    const [view,setView] = useState<'grid' | 'list'>('grid');

    return(
        <div>
            <div className="flex flex-col">
                <p className="flex flex-row gap-2">
                    <span>
                        loading
                    </span>
                    <span>
                        <Button onClick={()=>{setView((prev)=>(prev=="grid" ? "list" : "grid"))}}>
                            {view == "grid"
                            ? <List size={12}/> 
                            :<Grid size={12}/>
                            }
                        </Button>
                    </span>
                </p>
            </div>
            {
            view == "grid"
            ? <div className="grid grid-cols-2 gap-3">
                {Array.from({length:6}).map((_, v)=>(<VenueCardSkeleton key={v} view="grid" />))}
            </div>
            : <div className="flex flex-col gap-4">
                {Array.from({length:6}).map((_, v)=>(<VenueCardSkeleton key={v} view="list" />))}
                </div>}
        </div>
     )
}