import { Star } from "lucide-react";

export function StarRating({rating}: {rating: number}) {


    return (
        <div>
            {
                rating !== 0
                ? <span className="flex flex-row gap-0.5">
                    {
                        Array.from({length:Math.floor(rating)}).map((_, idx)=> (<Star className="fill-foreground" size={16} key={idx}/>))
                    }
                </span>
                : <span>There's No Reviews Yet</span>
            }
        </div>
    )
}   