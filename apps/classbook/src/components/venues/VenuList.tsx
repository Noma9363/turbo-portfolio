"use client";

import { Venue } from "@/types/database";
import { VenueCard } from "./VenueCard";
import { useState } from "react";
import { Button } from "@repo/ui";
import { Grid, List } from "lucide-react";

interface VenueListProps{
    venues: Venue[];
    favoritedIds: string[] | null;
}

export function VenueList({venues, favoritedIds}:VenueListProps){
    const [view,setView] = useState<'grid' | 'list'>('grid');
    const venuesLength = (venues).length;

    return(
        <div>
            <div className="flex flex-col">
                <p className="flex flex-row gap-2">
                    <span>
                        {venuesLength} Result
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
                {venues.map((v)=>(<VenueCard isFavorited={favoritedIds?.includes(v.id) ?? false} key={v.id} venue={v} view="grid" />))}
            </div>
            : <div className="flex flex-col gap-4">
            {venues.map((v)=>(<VenueCard isFavorited={favoritedIds?.includes(v.id) ?? false} key={v.id} venue={v} view="list"/>))}
            </div>}
        </div>
     )
}