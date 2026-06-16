"use client";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui";
import { ReviewForm, ReviewFormProps } from "./ReviewForm";
import { useState } from "react";

export function ReviewFromDialog({productId}: ReviewFormProps){

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return(
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={()=>{
                    setDialogOpen(true)
                }}>리뷰 작성</Button>
            </DialogTrigger>
            <DialogContent className="fixed inset-0 max-w-full h-full rounded-none translate-x-0 translate-y-0 left-0 top-0 bg-transparent flex items-center justify-center p-0">
                <DialogClose className="absolute inset-0 bg-black/60 cursor-default" />
                <DialogHeader className="hidden">
                    <DialogTitle>Review Edit form</DialogTitle>
                    <DialogDescription>
                        this form can review the product
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full max-w-md relative z-10">
                    <ReviewForm productId={productId} onCancel={()=>{
                        setDialogOpen(false)
                    }} />
                </div>
            </DialogContent>
        </Dialog>
    )

}