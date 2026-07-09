import { Categories } from "@/types/database";
import { VenueList } from "./VenuList";
import { getFavoritesByUser, getVenues } from "@/queries/venues";
import { auth } from "@/auth";

interface searchParamsInterface {
    category?: string;
    minPrc?: number;
    maxPrc?: number;
}

export async function VenueListFetcher({ searchParams }: { searchParams: Promise<searchParamsInterface> }) {
    const session = await auth();
    const user_id = session?.user?.id;
    const favoritedIds = user_id ? await getFavoritesByUser(user_id) : [];

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
        <VenueList favoritedIds={favoritedIds} venues={venues} />
    )
}