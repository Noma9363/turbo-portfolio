"use client";
import { Button, Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui";
import { ReviewForm, ReviewFormProps } from "./ReviewForm";
import { useState } from "react";
import Link from "next/link";

interface ReviewFormDialogProps{
    productId: ReviewFormProps['productId'];
    userId: string | null; 
}

export function ReviewFromDialog({productId, userId}: ReviewFormDialogProps){

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return(
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">리뷰 작성</Button>
            </DialogTrigger>
            {
                (!userId) 
                ? (
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>로그인이 필요한 서비스입니다.</DialogTitle>
                            <DialogDescription>
                                로그인 하시겠습니까?
                            </DialogDescription>
                        </DialogHeader>
                        <div className="w-full max-w-md relative z-10 flex gap-2">
                            <Link href='/login'>
                                <Button>
                                    로그인
                                </Button>
                            </Link>
                            <Button variant="outline" onClick={()=>{setDialogOpen(false)}}>
                                취소
                            </Button>
                        </div>
                    </DialogContent>
                )
                : (<DialogContent className="fixed inset-0 max-w-full h-full rounded-none translate-x-0 translate-y-0 left-0 top-0 bg-transparent flex items-center justify-center p-0">
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
                </DialogContent>)
            }
            
        </Dialog>
    )

}