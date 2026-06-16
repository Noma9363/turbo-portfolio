import { auth } from "@/auth";
import { FilterBar } from "@/components/product/FilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewFromDialog } from "@/components/review/ReviewFormDialog";
import { getAllReviews } from "@/queries/reviews";
import { categories, CATEGORIES } from "@/types/database";


interface SearchParamsInterface {
    category?: string;
    sort?: string;
}
export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsInterface> }) {
    const {category: categoryParam} = await searchParams;
    const session = await auth();
    const user_id = session?.user?.id ?? null;
    const reviews = await getAllReviews();
    const category = CATEGORIES.includes(categoryParam as categories) ? categoryParam as categories : undefined;
    
    if (!reviews || !reviews.length) {

        return (
            <div>
                ERROR Review Preserve Failed
            </div>
        )
    }

    return (
        <div className="p-4">
            <FilterBar currentCategory={category} />
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-2">
                {
                    reviews.filter(f => !category || f.products.category === category).map((r => (<ProductCard key={r.id} product={r.products} />)))
                }
            </div>
            <section className="cards">
                {
                    reviews.map((r => (<ReviewCard review={r} currentUserId={user_id} />)))
                }
            </section>
            <ReviewFromDialog productId={reviews[0]!.product_id}/>
        </div>
    )
}