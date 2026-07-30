"use client";

import { Venue } from "@/types/database";
import { VenueCard } from "./VenueCard";
import { useState } from "react";
import { Button } from "@repo/ui";
import { Grid, List } from "lucide-react";

export interface VenueListProps{
    venues: Venue[];
    favoritedIds: string[] | null;
}

interface VenuListInternalProps extends VenueListProps{
    view: 'grid' | 'list';
    setView: ()=>void;
}

export function VenueList({venues, favoritedIds, view, setView}:VenuListInternalProps){
    const venuesLength = (venues).length;

    return(
        <div className="py-4">
            <div className="flex flex-col">
                <p className="flex flex-row gap-2 justify-between items-center pb-2">
                    <span className="text-sm text-muted-foreground">
                        {venuesLength} Result
                    </span>
                    <span className="hidden md:inline-block">
                        <Button onClick={()=>{setView()}} variant="ghost" size="sm">
                            {view == "grid"
                            ? <List size={12}/>
                            :<Grid size={12}/>
                            }
                        </Button>
                    </span>
                </p>
            </div>

            {/* 모바일: list 고정 */}
            <div className="flex md:hidden flex-col gap-4">
                {venues.map((v)=>(<VenueCard isFavorited={favoritedIds?.includes(v.id) ?? false} key={v.id} venue={v} view="list"/>))}
            </div>

            {/* md 이상: 토글에 따른 grid/list */}
            <div className="hidden md:block">
                {
                view == "grid"
                ? <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {venues.map((v)=>(<VenueCard isFavorited={favoritedIds?.includes(v.id) ?? false} key={v.id} venue={v} view="grid" />))}
                </div>
                : <div className="flex flex-col gap-4">
                {venues.map((v)=>(<VenueCard isFavorited={favoritedIds?.includes(v.id) ?? false} key={v.id} venue={v} view="list"/>))}
                </div>}
            </div>
        </div>
     )
}