"use client";

import { Venue } from "@/types/database";
import { AspectRatio, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, MembersValue } from "@repo/ui";
import { Heart } from "lucide-react";
import Link from "next/link";
import { PriceValue } from "../price/PriceValue";
import { LocationLabel } from "../location/LocationLabel";

export function VenueCard({ venue }: { venue: Venue }) {

    return (
        <Link href={``} className="block">
            <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300")}>
                <CardHeader className="relative p-0">
                    <AspectRatio ratio={1.268115942} className="overflow-hidden rounded-xl">
                        <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} />
                    </AspectRatio>
                    <Button size="icon" className="absolute left-4 top-4">
                        <Heart />
                    </Button>
                </CardHeader>
                <CardContent>
                    <CardTitle className="flex flex-row justify-items-center gap-2">
                        <span>
                            {venue.title}
                        </span>
                        <MembersValue capacity={venue.capacity} />
                    </CardTitle>
                    <CardDescription>
                        <PriceValue value_name="시간당" price={venue.price}/>
                        <LocationLabel location={venue.address}/>
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}