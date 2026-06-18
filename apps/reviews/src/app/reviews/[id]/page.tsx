import { auth } from "@/auth";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewFromDialog } from "@/components/review/ReviewFormDialog";
import { getProductById } from "@/queries/products";
import { getReviewsByProductId } from "@/queries/reviews";
import { Card, Separator } from "@repo/ui";
import { Star } from "lucide-react";

interface Params {
    id: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
    const session = await auth()
    const user_id = session?.user?.id ?? null;
    const { id } = await params;
    const product = await getProductById(id);
    const reviews = await getReviewsByProductId(id);

    const reviewCnt = reviews?.length ?? 0;
    const avgRating = reviewCnt > 0
    ? reviews!.reduce((sum, r)=> sum + r.rating, 0) / reviewCnt
    : 0;

    if (product === null) {
        return (
            <div>
                There's No Product Presnet
            </div>
        )
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <section className="">
                <p>
                    <span className="text-sm">
                        {product.category}
                    </span>
                </p>
                <div className="font-bold pb-3 flex flex-row justify-between items-center">
                    <h1 className="text-4xl">
                        {product.name}
                    </h1>
                    <p className="text-2xl">
                        <span>
                            $
                        </span>
                        <span>
                            {product.price}
                        </span>
                    </p>
                </div>
                {
                /* rating area  get all reviews and calculate the rating then render star icon */
                }
                <p className="pb-4">
                    {
                        avgRating !== 0
                        ? <span className="flex flex-row">{
                            Array.from({length: Math.floor(avgRating)}).map((_, idx)=>(<Star key={idx}/>))
                            }</span>
                        : <span>There's No Reviews Yet</span>
                    }
                </p>
                <Card className="bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 aspect-square overflow-hidden relative">
                    <img src={product.image_url} alt={`${product.name} name`} />
                </Card>
                <Separator className="mt-6 mb-4 bg-zinc-600 h-px" />
                <article className="text-muted-foreground pb-4">
                    {product.description}
                </article>
            </section>
            <section className="pb-4">
                <ReviewFromDialog productId={product.id} />
            </section>
            <section className="">
                <h2 className="text-3xl font-semibold">
                    Users Reviews {reviews?.length}
                </h2>
                {
                    reviews == null
                        ? (<Card>there's no reviews</Card>)
                        : (reviews.map(r => (<ReviewCard key={r.id} review={r} currentUserId={user_id} />)))
                }
            </section>
        </div>
    )
}