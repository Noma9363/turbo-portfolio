import {CreateReviewInput, reviews, ReviewWithProduct} from '@/types/database';
import {supabase} from '@/lib/supabase/client';

export const getAllReviews = async ():Promise<ReviewWithProduct[]|null> =>{
    const {data, error} = await supabase.from('reviews').select('*, products(name, category, image_url, description, label, price)')
    if(!data){
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}

export const createReview = async (ipt:CreateReviewInput):Promise<reviews|null> => {
    const {data, error} = await supabase.from('reviews').insert(ipt).select().single();
    if(!data){
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}

export const deleteReview = async (id: string, user_id: string):Promise<boolean|null>=>{
    const {error} = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', user_id);
    
    return !error
}