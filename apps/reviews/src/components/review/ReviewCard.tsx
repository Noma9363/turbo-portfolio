"use client";

import { ReviewWithUser } from "@/types/database";
import { Avatar, AvatarFallback, AvatarImage, Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { StarRating } from "./StarRating";

interface ReviewCardProps {
    review: ReviewWithUser;
    currentUserId: string | null;
}

export function ReviewCard({ review, currentUserId }: ReviewCardProps) {


    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>
                    <div className="flex gap-4">
                        <Avatar className="ring-1">
                            <AvatarImage src={review.users.name} />
                            <AvatarFallback>
                                {review.users.name as string}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-sm pb-4">
                            <span className="font-medium">{review.users.name}</span>
                            <span className="font-light text-card-foreground">{new Date(review.created_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                    </div>
                    <p className="font-bold text-2xl">
                        {review.title}
                    </p>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-8">
                <div>
                    <StarRating rating={review.rating}/>
                </div>
                <p>
                    <span className="text-card-foreground">
                        {review.body}
                    </span>
                </p>
            </CardContent>
            {review.user_id === currentUserId && (
                <CardFooter>
                    <DeleteConfirmDialog review={review} />
                </CardFooter>
            )}
        </Card>
    )
}