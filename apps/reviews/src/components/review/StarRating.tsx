import { Star } from "lucide-react";

const sizeMap: Record<'sm' | 'md' | 'lg', number> = {
    sm: 16,
    md: 20,
    lg: 24
}

export function StarRating({rating, reviews, size = 'sm'}: {rating: number, reviews?:number, size?: 'sm'|'md'|'lg' | number}) {
    
    const svgSize = typeof size ==='number' ? size : sizeMap[size];

    return (
        <div>
            {
                rating !== 0
                ? <p className="flex flex-row gap-0.5">
                    {
                        Array.from({length:Math.floor(rating)}).map((_, idx)=> (<Star className="fill-foreground" size={svgSize} key={idx}/>))
                    }
                    <span className="text-xs pl-2">{reviews} reviews available</span>
                </p>
                : 
                <p className="text-sm text-muted-foreground flex items-center">
                    {Array.from({length:5}).map((_,idx)=> (<Star key={idx} size={svgSize} className="fill-none stroke-muted-foreground" />))}
                    
                    <span className="text-xs pl-2">No reviews yet</span>
                </p>
            }
        </div>
    )
}   