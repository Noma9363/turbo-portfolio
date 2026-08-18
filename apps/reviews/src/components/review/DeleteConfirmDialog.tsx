"use client";

import { deleteReviewAction } from "@/actions/reviews";
import { ReviewWithUser } from "@/types/database";
import { Button, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui";
import { useState } from "react";

interface DeleteConfirmDialogProps {
    review: ReviewWithUser
}

export function DeleteConfirmDialog({ review }: DeleteConfirmDialogProps) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                    setDialogOpen(true)
                }}>
                    리뷰 삭제
                </Button>
            </DialogTrigger>
            <DialogContent
                className="fixed inset-0 max-w-full h-full rounded-none translate-x-0 translate-y-0 left-0 top-0 bg-transparent flex items-center justify-center p-0"
            >
                <DialogClose className="absolute inset-0 bg-black/60 cursor-default" />
                <div className="w-full max-w-md relative z-10">
                    <DialogHeader>
                        <DialogTitle>
                            해당 리뷰를 지울까요?
                        </DialogTitle>
                    </DialogHeader>
                    <form action={deleteReviewAction}>
                        <input hidden name="id" defaultValue={review.id} />
                        <input hidden name="product_id" defaultValue={review.product_id} />
                        <Button type="submit">Submit</Button>
                        <Button variant="outline" onClick={() => {
                            setDialogOpen(false)
                        }}>Cancel</Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}