import { FilterBar } from "@/components/product/FilterBar";
import { ProductCard } from "@/components/product/ProductCard";
import { getProducts } from "@/queries/products";
import { categories, CATEGORIES } from "@/types/database";


interface SearchParamsInterface {
    category?: string;
    sort?: string;
}
export default async function Page({ searchParams }: { searchParams: Promise<SearchParamsInterface> }) {
    const { category: categoryParam } = await searchParams;
    const products = await getProducts();
    const category = CATEGORIES.includes(categoryParam as categories) ? categoryParam as categories : undefined;


    if (products === null) {
        return (
            <div>
                There's No Products Presnet
            </div>
        )
    }

    return (
        <div className="p-4">
            <FilterBar currentCategory={category} />
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-2 gap-2">
                {
                    products.map((r => (<ProductCard key={r.id} product={r} />)))
                }
            </div>
            <section className="cards">
                section card
            </section>
        </div>
    )
}