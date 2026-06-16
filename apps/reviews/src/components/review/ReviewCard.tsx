import { ReviewWithProduct } from "@/types/database";
import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface ReviewCardProps {
    review: ReviewWithProduct;
    currentUserId: string | null;
}

export function ReviewCard({ review, currentUserId }: ReviewCardProps) {
    return (
        <Card>
            <CardHeader>
                <Badge>user_name</Badge>
                <p>{review.created_at}</p>
                <CardTitle>
                    {review.title}
                </CardTitle>
                <p>
                    {review.rating}
                </p>
            </CardHeader>
            <CardContent>
                <p>
                    {review.body}
                </p>
            </CardContent>
            {review.user_id === currentUserId && (<CardFooter>
                <DeleteConfirmDialog review={review} />
            </CardFooter>)}

        </Card>
    )
}