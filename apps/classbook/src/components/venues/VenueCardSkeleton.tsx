import { Card, CardContent, cn, Skeleton } from "@repo/ui";

export function VenueCardSkeleton({view}:{view:'grid' | 'list'}){
    if(view==='list'){
        return(
            <Card className={cn("border-0 bg-background text-card-foreground  transition-colors duration-300 flex flex-row overflow-hidden")}>
                <Skeleton className="relative w-full max-w-40 h-full max-h-32 rounded-xl overflow-hidden" style={{"paddingBottom" : '128px'}}/>
                <CardContent className="pt-0 pb-4 flex flex-col gap-1.5 justify-start ">
                    <Skeleton className="h-4 w-3/4 flex flex-row justify-items-center gap-2 pb-1"/>
                    <Skeleton className="h-4 w-3/4 flex flex-row justify-items-center gap-2 pb-1"/>
                </CardContent>
            </Card>
        )
    }
    return(
        <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 overflow-hidden")}>
                <Skeleton className="relative w-full" style={{ paddingBottom: '56.25%' }} />
                <CardContent className="pt-4 pb-4 flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-3/4 flex flex-row justify-items-center gap-2 pb-1"/>
                    <Skeleton className="h-4 w-3/4 flex flex-row justify-items-center gap-2 pb-1"/>
                </CardContent>
            </Card>
    )
}