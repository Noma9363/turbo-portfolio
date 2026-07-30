import { cn } from "@repo/ui";
import { MapPin } from "lucide-react";

interface LocationLabelProps {
    location: string;
    size?: string | number;
    className?: string;
}

export function LocationLabel ({location, size = 12, className}:LocationLabelProps){
    return(
        <div className={cn("flex flex-row items-center gap-0.5 min-w-0", className)}>
            <MapPin size={size} className="shrink-0" /><span className="truncate">{location.split(' ').slice(0,2).join(' ')}</span>
        </div>
    )
}