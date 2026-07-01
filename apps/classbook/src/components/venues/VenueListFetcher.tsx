import { Categories } from "@/types/database";
import { VenueList } from "./VenuList";
import { getVenues } from "@/queries/venues";

interface searchParamsInterface {
    category?: string;
    minPrc?: number;
    maxPrc?: number;
}

export async function VenueListFetcher({ searchParams }: { searchParams: Promise<searchParamsInterface> }) {
    const { category: categoryParam } = await searchParams;
    const category = categoryParam as Categories | undefined;

    const venues = await getVenues({ category })
    if (venues === null) {
        return (
            <div>
                There's No Venues Presnt
            </div>
        )
    }
    return (
        <VenueList venues={venues} />
    )
}