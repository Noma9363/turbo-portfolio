"use client";

import { ReviewWithUser } from "@/types/database";
import { Avatar, AvatarFallback, Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface ReviewCardProps {
    review: ReviewWithUser;
    currentUserId: string | null;
}

export function ReviewCard({ review, currentUserId }: ReviewCardProps) {
    
    
    return (
        <Card>
            <CardHeader>
                <Avatar>
                    <AvatarFallback>
                        {review.users.name as string}
                    </AvatarFallback>
                </Avatar>
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