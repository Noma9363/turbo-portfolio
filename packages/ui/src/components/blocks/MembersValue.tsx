import { Users } from "lucide-react";

interface MembersValueProps{
    capacity: number;
}

export function MembersValue({capacity}:MembersValueProps){
    return(
        <div className="flex flex-row gap-0.5 justify-items-center">
            <Users size={20} /><span>{capacity}</span>
        </div>
    )
}