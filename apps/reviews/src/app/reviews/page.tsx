import { FilterBar } from "@/components/product/FilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { getAllReviews } from "@/queries/reviews";
import { categories, CATEGORIES } from "@/types/database";

interface SearchParamsInterface {
    category?: string;
    sort?: string;
}
export default async function Page({ searchParams }: { searchParams: SearchParamsInterface }) {

    const reviews = await getAllReviews();
    const category = CATEGORIES.includes(searchParams.category as categories) ? searchParams.category as categories : undefined;

    if (!reviews || !reviews.length) {

        return (
            <div>
                ERROR Review Preserve Failed
            </div>
        )
    }

    return (
        <div>
            reviewResult is {reviews?.length}
            <FilterBar currentCategory={category} />
            {
                reviews.filter(f => !category || f.products.category === category).map((r => (<ProductCard key={r.id} product={r.products} />)))
            }
        </div>
    )
}