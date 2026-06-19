import {products} from '@/types/database'
import {supabase} from "@/lib/supabase/client";

export const getProducts = async ():Promise<products[]|null> => {
    const {data, error } = await supabase.from('products').select('*');
    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}
export const getProductsByCategory = async (category: string):Promise<products[]|null> => {
    const {data, error} = await supabase.from('products').select('*').eq('category', category);

    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}
export const getProductById = async (id: string):Promise<products|null> => {
    const {data, error} = await supabase.from('products').select('*').eq('id', id).single();

    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}

