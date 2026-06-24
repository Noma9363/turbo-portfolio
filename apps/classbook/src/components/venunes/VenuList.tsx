"use client";

import { Venue } from "@/types/database";
import { VenueCard } from "./VenueCard";
import { useState } from "react";
import { Button } from "@repo/ui";
import { Grid, List } from "lucide-react";

interface VenueListProps{
    venues: Venue[];
}

export function VenueList({venues}:VenueListProps){
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
                {venues.map((v)=>(<VenueCard key={v.id} venue={v}/>))}
            </div>
            : <div className="flex flex-col">
            {venues.map((v)=>(<VenueCard key={v.id} venue={v}/>))}
            </div>}
        </div>
     )
}