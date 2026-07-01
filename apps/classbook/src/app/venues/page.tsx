import { FilterBar } from "@/components/filter/FilterBar";
import { VenueListFetcher } from "@/components/venues/VenueListFetcher";
import { VenueListSkeleton } from "@/components/venues/VenuListSkeleton";
import { Categories } from "@/types/database";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

interface SearchParamsInterface {
    category?: string;
    minPrc?: number;
    maxPrc?: number;
}

export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsInterface> }) {
    const { category: categoryParam } = await searchParams;
    const category = categoryParam as Categories | undefined;

    return (
        <div>
            <FilterBar currentCategory={category} />
            <Suspense fallback={<VenueListSkeleton />}>
                <VenueListFetcher searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
