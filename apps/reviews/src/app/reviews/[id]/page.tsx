import { auth } from "@/auth";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewFromDialog } from "@/components/review/ReviewFormDialog";
import { StarRating } from "@/components/review/StarRating";
import { reviewAvg } from "@/lib/reviews";
import { getProductById } from "@/queries/products";
import { getReviewsByProductId } from "@/queries/reviews";
import { Card, Separator } from "@repo/ui";
import Link from "next/link";
import { redirect } from "next/navigation";

interface Params {
    id: string;
}

export default async function Page({ params }: { params: Promise<Params> }) {
    const session = await auth()
    const user_id = session?.user?.id ?? null;
    const { id } = await params;
    const product = await getProductById(id);
    const reviews = await getReviewsByProductId(id);

    if (product === null) {
        return (
            <div className="py-20 max-w-md mx-auto my-auto text-center flex flex-col gap-8">
                <p className="flex flex-col gap-10">
                    <span className="font-bold">404</span>
                    <span className="text-3xl font-bold">Page not found</span>
                </p>
                <p>
                    <span>
                        해당 페이지를 찾을 수 없습니다.
                    </span>
                </p>
                <p>
                    <span className="pt-12 pb-6">
                        <Link href='/reviews'>
                            Return to Homepage
                        </Link>
                    </span>
                </p>
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
                        <span>$</span><span>{product.price}</span>
                    </p>
                </div>
                {
                /* rating area  get all reviews and calculate the rating then render star icon */
                }
                <div className="pb-4">
                    <StarRating rating={reviewAvg(reviews)}/>
                </div>
                <Card className="bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 aspect-square overflow-hidden relative">
                    <img src={product.image_url} alt={`${product.name} name`} />
                </Card>
                <Separator className="mt-6 mb-4 bg-zinc-600 h-px" />
                <article className="text-muted-foreground pb-4">
                    {product.description}
                </article>
            </section>
            <section className="pb-4">
                <ReviewFromDialog productId={product.id} userId={user_id} />
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