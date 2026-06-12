import {ReviewWithProduct} from '@/types/database';
import {supabase} from '@/lib/supabase/client';

export const getAllReviews = async ():Promise<ReviewWithProduct[]|null> =>{
    const {data, error} = await supabase.from('reviews').select('*, products(name, category, image_url, description, label, price)')
    if(!data){
        console.error(JSON.stringify(error))
        return null;
    }
    return data;
}