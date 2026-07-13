import { LocateIcon, Navigation, PinIcon } from "lucide-react";

interface PriceValueProps{
    value_name: string;
    price: number;
}

export function PriceValue ({value_name, price}:PriceValueProps){
    return(
        <div className="flex justify-start justify-items-center">
          <span className="relative pr-2 after:content-['/'] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2">{value_name}</span><span className="font-semibold tracking-wide pl-1">{price}원~</span>
        </div>
    )
}