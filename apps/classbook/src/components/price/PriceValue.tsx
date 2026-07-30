import { cn } from "@repo/ui";

interface PriceValueProps{
    value_name: string;
    price: number;
    className?: string;
    priceClassName?: string;
}

export function PriceValue ({value_name, price, className, priceClassName}:PriceValueProps){
    return(
        <div className={cn("flex items-center gap-1.5 whitespace-nowrap", className)}>
          <span className="flex items-center justify-center rounded bg-muted px-1.5 py-0.5 text-[0.8em] text-foreground leading-none">{value_name}</span>
          <span className={cn("font-semibold tracking-wide", priceClassName)}>{price}원~</span>
        </div>
    )
}