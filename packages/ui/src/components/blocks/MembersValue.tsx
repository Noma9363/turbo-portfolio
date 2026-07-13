import { cn } from "../../lib/utils";
import { Users } from "lucide-react";

interface MembersValueProps{
    capacity: number;
    className?: string;
    size?: string | number;
}

export function MembersValue({capacity, className, size = 20}:MembersValueProps){
    return(
        <div className={cn("flex flex-row gap-0.5 justify-items-center items-center", className)}>
            <Users size={size} /><span>{capacity}</span>
        </div>
    )
}