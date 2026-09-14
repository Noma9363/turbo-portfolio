import { CreateReviewInput, products, reviews, ReviewWithProduct, ReviewWithUser, user } from '@/types/database';
import { supabase } from '@/lib/supabase/client';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const getAllReviews = async (): Promise<ReviewWithProduct[] | null> => {
    const { data, error } = await supabase.from('reviews').select('*, products(name, category, image_url, description, label, price)');
    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return attachUserNames(data);
}

export const createReview = async (ipt: CreateReviewInput): Promise<reviews | null> => {
    const { data, error } = await supabaseAdmin.from('reviews').insert(ipt).select().single();
    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}

export const deleteReview = async (id: string, user_id: string): Promise<{ product_id: string } | null> => {
    const { data, error } = await supabaseAdmin
        .from('reviews')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id)
        .select('product_id')
        .single();

    if (error) return null;
    return data;
}

export const getReviewsByProductId = async (productId: string): Promise<ReviewWithUser[] | null> => {
    const { data, error } = await supabase.from('reviews').select('*').eq('product_id', productId);

    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return attachUserNames(data);
}

const attachUserNames = async <T extends { user_id: string }>(rows: T[]): Promise<(T & { users: Pick<user, 'name'> })[]> => {
    const userIds = [...new Set(rows.map(r => r.user_id))];
    const { data: users } = await supabase.from('public_users').select('id, name').in('id', userIds);
    const nameById = new Map((users ?? []).map(u => [u.id, u.name]));
    return rows.map(r => ({ ...r, users: { name: nameById.get(r.user_id) ?? '알 수 없음' } }));
} 