"use server"

import {auth} from "@/auth";
import { createReview } from "@/queries/reviews";
import { CreateReviewInput } from "@/types/database"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createReviewAction = async (formData : FormData) => {
    // get get session info of current logged from server
    const session = await auth();
    const user_id = session?.user?.id;
    if(!user_id) return;

    const product_id = formData.get('product_id') as string;
    const rating = Number(formData.get('rating'));
    const title = formData.get('title') as string;
    const body = formData.get('body') as string;
    
    const input:CreateReviewInput = {user_id, product_id, rating, title, body}

    await createReview(input);
    revalidatePath('/reviews');
    redirect('/reviews');
}