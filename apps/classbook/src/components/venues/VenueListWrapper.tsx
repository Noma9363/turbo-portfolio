"use client";

import { Categories } from "@/types/database";
import { FilterBar } from "../filter/FilterBar";
import { VenueList, VenueListProps } from "./VenuList";
import { useState } from "react";

interface VenueListWrapperProps extends VenueListProps{
    currentCategory: Categories;
}

export function VenueListWrapper({venues, favoritedIds, currentCategory}:VenueListWrapperProps){
    const [view,setView] = useState<'grid' | 'list'>('grid');
    const toggleView = () => setView((prev)=>(prev === "grid" ? "list" : "grid"));
    
    return(
        <div>
            <FilterBar view={view} setView={toggleView} currentCategory={currentCategory} />
            <VenueList view={view} setView={toggleView} venues={venues} favoritedIds={favoritedIds}/>
        </div>
    )
}