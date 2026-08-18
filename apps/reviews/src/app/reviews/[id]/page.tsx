import { auth } from "@/auth";
import { ReviewCard } from "@/components/review/ReviewCard";
import { ReviewFromDialog } from "@/components/review/ReviewFormDialog";
import { StarRating } from "@/components/review/StarRating";
import { reviewAvg } from "@/lib/reviews";
import { getProductById } from "@/queries/products";
import { getReviewsByProductId } from "@/queries/reviews";
import { Badge, Card, Separator } from "@repo/ui";
import Image from "next/image";
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
                <Badge className="w-fit px-2 mb-2">
                    {product.category}
                </Badge>
                <div className="font-bold pb-3 flex flex-row justify-between items-center">
                    <h1 className="text-3xl">
                        {product.name}
                    </h1>
                    <p className="text-xl">
                        <span>$</span><span>{product.price}</span>
                    </p>
                </div>
                {
                /* rating area  get all reviews and calculate the rating then render star icon */
                }
                <div className="pb-4">
                    <StarRating showLgn size="md" rating={reviewAvg(reviews)} reviews={reviews?.length} />
                </div>
                <Card className="bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 aspect-square overflow-hidden relative">
                    {product.image_url &&
                        <Image
                            className="object-contain"
                            src={product.image_url}
                            alt={`${product.name} name`}
                            fill
                            sizes="(max-width: 768px) 100vw, 448px"
                            priority
                        />
                    }
                </Card>
                {product.label &&
                    <div className="flex flex-row flex-wrap gap-2 mt-3">
                        {(product.label).map((l,idx) => (<Badge key={idx+l}>{l}</Badge>))}
                    </div>
                }
                <Separator className="mt-4 mb-4 bg-zinc-600 h-px  mx-auto" />
                <article className="text-muted-foreground pb-4">
                    {product.description}
                </article>
            </section>
            <section className="pb-4">
                <ReviewFromDialog productId={product.id} userId={user_id} />
            </section>
            <section className="pb-4">
                <h2 className="text-xl font-semibold pb-3">
                    Reviews {reviews?.length ?? 0}
                </h2>
                {
                    reviews == null || reviews.length === 0
                        ? (<p className="text-muted-foreground text-sm pt-2">No reviews yet. Be the first to write one!</p>)
                        : (<div className="flex flex-col gap-3">{reviews.map(r => (<ReviewCard key={r.id} review={r} currentUserId={user_id} />))}</div>)
                }
            </section>
        </div>
    )
}