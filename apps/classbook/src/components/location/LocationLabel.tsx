import { MapPin } from "lucide-react";

interface LocationLabelProps {
    location: string;
}

export function LocationLabel ({location}:LocationLabelProps){
    return(
        <div className="text-ellipsis flex flex-row items-center gap-0.5">
            <MapPin size={12} /><span>{location.split(' ').slice(0,2).join(' ')}</span>
        </div>
    )
}