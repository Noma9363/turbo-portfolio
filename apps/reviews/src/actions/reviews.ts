"use server"

import {auth} from "@/auth";
import { createReview, deleteReview } from "@/queries/reviews";
import { CreateReviewInput } from "@/types/database"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO: createReviewAction 검증 차단 이후 useActionState로 반환값을 받아 표시하는 게 표준 패턴 — 처리 예정
export const createReviewAction = async (formData : FormData) => {
    // get get session info of current logged from server
    const session = await auth();
    const user_id = session?.user?.id;
    if(!user_id) return;

    const product_id = formData.get('product_id') as string;
    const rating = Number(formData.get('rating'));
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    
    if (!title.trim() || !body.trim()) return {error : '제목 및 본문은 필수입니다.'};
    if (Number.isNaN(rating) || rating < 1 || rating > 5) return {error: '점수가 올바르지 않습니다.'};

    const input:CreateReviewInput = {user_id, product_id, rating, title, body}

    await createReview(input);
    revalidatePath(`/reviews/${product_id}`);
    redirect(`/reviews/${product_id}`);
}

export const deleteReviewAction = async (formData: FormData) => {
    const session = await auth();
    const user_id = session?.user?.id as string;
    const current_id = formData.get('id') as string;
    if(!user_id) return;
    
    await deleteReview(current_id, user_id);
    revalidatePath('/reviews');
}