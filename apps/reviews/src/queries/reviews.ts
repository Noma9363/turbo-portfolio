import {ReviewWithProduct} from '@/types/database';
import {supabase} from '@/lib/supabase/client';

export const getAllReviews = async ():Promise<ReviewWithProduct[]|null> =>{
    const {data, error} = await supabase.from('reviews').select('*, products(name, category)')
    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}