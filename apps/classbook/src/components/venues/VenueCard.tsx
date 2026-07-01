"use client";

import { Venue } from "@/types/database";
import { AspectRatio, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, MembersValue } from "@repo/ui";
import { Heart } from "lucide-react";
import Link from "next/link";
import { PriceValue } from "../price/PriceValue";
import { LocationLabel } from "../location/LocationLabel";

export function VenueCard({ venue, view }: { venue: Venue, view: 'grid' | 'list' }) {

    if (view === 'list') {
        return (
            <Link href={``} className="block">
                <Card className={cn("border-0 bg-background text-card-foreground  transition-colors duration-300 flex flex-row overflow-hidden")}>
                    <div className="relative w-full max-w-40 h-full max-h-32 rounded-xl overflow-hidden" style={{"paddingBottom" : '128px'}}>
                        <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                        <Button size="icon" className="absolute left-2 top-2">
                            <Heart size="icon"/>
                        </Button>
                        <Badge className="text-accent-foreground bg-primary-foreground ring-accent-foreground w-fit absolute left-2 bottom-2">{venue.category}</Badge>
                    </div>
                    <CardContent className="pt-0 pb-4 flex flex-col gap-1.5 justify-start ">
                        <CardTitle className="flex flex-row justify-items-center gap-2 pb-1">
                            <span className="truncate text-base">
                                {venue.title}
                            </span>
                            <MembersValue capacity={venue.capacity} className="text-base" size={15} />
                        </CardTitle>
                        <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
                            <PriceValue value_name="시간당" price={venue.price} />
                            <LocationLabel size={14} location={venue.address} />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={``} className="block">
            <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 overflow-hidden")}>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                    <Button size="icon" className="absolute left-4 top-4">
                        <Heart />
                    </Button>
                    <Badge className="text-accent-foreground bg-primary-foreground ring-accent-foreground w-fit absolute left-4 bottom-4">{venue.category}</Badge>
                </div>
                <CardContent className="pt-4 pb-4 flex flex-col gap-1.5">
                    <CardTitle className="flex flex-row justify-items-center gap-2 pb-1">
                        <span className="truncate">
                            {venue.title}
                        </span>
                        <MembersValue capacity={venue.capacity} />
                    </CardTitle>
                    <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
                        <PriceValue value_name="시간당" price={venue.price} />
                        <LocationLabel location={venue.address} />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}