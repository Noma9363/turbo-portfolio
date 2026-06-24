import { supabase } from "@/lib/supabase/client"
import { Categories, Venue } from "@/types/database"

// 모든 강의실 조회
export const getVenues = async ():Promise<Venue[] | null> => {
    const {data, error} = await supabase.from('venues').select('*');

    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}

// 카테고리별로 강의실 조회
export const getVenuesByCategory = async (category: Categories):Promise<Venue[]|null> => {
    const {data, error} = await supabase.from('venues').select('*').eq('category', category);

    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}

// 아이디로 단일 강의실 조회
export const getVenueById = async (id: string):Promise<Venue|null> => {
    const {data, error} = await supabase.from('venues').select('*').eq('id', id).single();

    if(!data){
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}