import { MapPin } from "lucide-react";

interface LocationLabelProps {
    location: string;
    size?: string | number;
}

export function LocationLabel ({location, size = 12}:LocationLabelProps){
    return(
        <div className="text-ellipsis flex flex-row items-center gap-0.5">
            <MapPin size={size} /><span>{location.split(' ').slice(0,2).join(' ')}</span>
        </div>
    )
}