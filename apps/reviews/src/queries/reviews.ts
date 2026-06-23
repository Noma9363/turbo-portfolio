import { CreateReviewInput, products, reviews, ReviewWithProduct, ReviewWithUser } from '@/types/database';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const getAllReviews = async (): Promise<ReviewWithProduct[] | null> => {
    const { data, error } = await supabase.from('reviews').select('*, products(name, category, image_url, description, label, price), users(name)');
    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}

export const createReview = async (ipt: CreateReviewInput): Promise<reviews | null> => {
    const { data, error } = await supabaseAdmin.from('reviews').insert(ipt).select().single();
    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}

export const deleteReview = async (id: string, user_id: string): Promise<boolean | null> => {
    const { error } = await supabaseAdmin
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);

    return !error
}

export const getReviewsByProductId = async (productId: string): Promise<ReviewWithUser[] | null> => {
    const { data, error } = await supabase.from('reviews').select('*, users(name)').eq('product_id', productId);

    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
} 