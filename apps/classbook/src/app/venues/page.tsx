import { VenueListFetcher } from "@/components/venues/VenueListFetcher";
import { VenueListSkeleton } from "@/components/venues/VenuListSkeleton";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface SearchParamsInterface {
    category?: string;
    minPrc?: number;
    maxPrc?: number;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsInterface> }) {
    return (
        <div>
            <Suspense fallback={<VenueListSkeleton />}>
                <VenueListFetcher searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
