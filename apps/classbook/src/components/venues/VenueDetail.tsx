import { Venue } from "@/types/database";
import { MapPin } from "lucide-react";
import { VenueDetailContent } from "./VenueDetailContent";

interface Props {
    venue: Venue;
}

export function VenueDetail({ venue }: Props) {
    return (
        <section className="pt-4">
            <article>
                <p className="font-semibold text-xs text-muted-foreground">{venue.sub_title}</p>
                <h2 className="font-bold text-2xl">{venue.title}</h2>
                <address className="flex flex-row gap-1 items-center pt-2">
                    <MapPin size={12} className="text-muted-foreground"/>
                    <span className="not-italic font-light text-xs text-muted-foreground">{venue.address}</span>
                </address>
            </article>
            <VenueDetailContent venue={venue} />
            <article>

            </article>
        </section>
    );
}
