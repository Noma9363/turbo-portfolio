"use server";

import { auth } from "@/auth";
import { addFavorite, removeFavorite } from "@/queries/venues";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const createFavoritAction = async (venue_id: string) => {
    const session = await auth();
    const user_id = session?.user?.id;
    const prev_url = (await headers()).get('referer');
    
    if(!user_id){
        redirect(`/login?callbackUrl=${prev_url}`);
    }

    await addFavorite(user_id, venue_id);
    revalidatePath('/venues');
}

export const removeFavoritAction = async (venue_id: string) => {
    const session = await auth();
    const user_id = session?.user?.id;
    const prev_url = (await headers()).get('referer');
    
    if(!user_id){
        redirect(`/login?callbackUrl=${prev_url}`);
    }

    await removeFavorite(user_id, venue_id);
    revalidatePath('/venues');
}