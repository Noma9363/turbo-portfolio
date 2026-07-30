"use client";

import { Venue } from "@/types/database";
import { AspectRatio, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, cn, MembersValue } from "@repo/ui";
import { Heart } from "lucide-react";
import Link from "next/link";
import { PriceValue } from "../price/PriceValue";
import { LocationLabel } from "../location/LocationLabel";
import { createFavoritAction, removeFavoritAction } from "@/actions/favorite";

export function VenueCard({ venue, view, isFavorited }: { venue: Venue, view: 'grid' | 'list', isFavorited: boolean }) {

    if (view === 'list') {
        return (
            <Link href={`/venues/${venue.id}`} className="block">
                <Card className={cn("border-0 bg-background text-card-foreground  transition-colors duration-300 flex flex-row overflow-hidden")}>
                    <div className="relative w-1/3 md:w-40 aspect-square md:aspect-auto md:h-32 shrink-0 rounded-xl overflow-hidden">
                        <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                        <Button onClick={(e) => {
                            e.preventDefault();
                            isFavorited ? removeFavoritAction(venue.id) : createFavoritAction(venue.id)
                        }} size="icon" aria-label="찜하기" className="absolute left-1.5 top-1.5 h-6 w-6 md:left-2 md:top-2 md:h-10 md:w-10">
                            <Heart size={12} className={cn("md:hidden", isFavorited ? 'fill-red-500' : '')} />
                            <Heart size="icon" className={cn("hidden md:block", isFavorited ? 'fill-red-500' : '')} />
                        </Button>
                        <Badge className="text-accent-foreground bg-primary-foreground ring-accent-foreground w-fit absolute left-1.5 bottom-1.5 text-[10px] px-1.5 py-0 md:left-2 md:bottom-2 md:text-xs md:px-2.5 md:py-0.5">{venue.category}</Badge>
                    </div>
                    <CardContent className="py-0 flex flex-col justify-between min-w-0 flex-1 self-stretch">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="flex flex-row items-center justify-between md:justify-start gap-2 text-sm md:text-xl">
                                <span className="truncate min-w-0">
                                    {venue.title}
                                </span>
                                <MembersValue capacity={venue.capacity} className="text-sm md:text-xl shrink-0" size={13} />
                            </CardTitle>
                            <PriceValue
                                value_name="시간당"
                                price={venue.price}
                                className="text-sm md:text-base"
                                priceClassName="text-sm font-semibold md:text-lg md:font-bold"
                            />
                        </div>
                        <LocationLabel size={13} location={venue.address} className="text-xs text-muted-foreground" />
                    </CardContent>
                </Card>
            </Link>
        )
    }

    return (
        <Link href={`/venues/${venue.id}`} className="block">
            <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 overflow-hidden")}>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            isFavorited ? removeFavoritAction(venue.id) : createFavoritAction(venue.id)
                        }}
                        size="icon" aria-label="찜하기" className="absolute left-4 top-4">
                        <Heart className={cn(`${isFavorited ? 'fill-red-500' : ''}`)} />
                    </Button>
                    <Badge className="text-accent-foreground bg-primary-foreground ring-accent-foreground w-fit absolute left-4 bottom-4">{venue.category}</Badge>
                </div>
                <CardContent className="pt-4 pb-4 flex flex-col gap-1.5">
                    <CardTitle className="flex flex-row items-center gap-2 pb-1">
                        <span className="truncate min-w-0">
                            {venue.title}
                        </span>
                        <MembersValue capacity={venue.capacity} className="shrink-0" />
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