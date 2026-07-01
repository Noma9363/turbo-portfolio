import { auth } from "@/auth";
import { supabase } from "@/lib/supabase/client"
import { Categories, CreateReservation, Reservation, Venue } from "@/types/database"

interface GetVenuesParam {
    category?: Categories;
    minPrc?: number;
    maxPrc?: number;
}

// 모든 강의실 조회
export const getVenues = async (params?: GetVenuesParam): Promise<Venue[] | null> => {
    let query = supabase.from("venues").select('*');
    if (params?.category) query = query.eq('category', params.category);
    if (params?.minPrc) query = query.gte('price', params.minPrc);
    if (params?.maxPrc) query = query.lte('price', params.maxPrc);
    const { data, error } = await query;

    if (!data) {
        console.error(error, `error! : ${error}`);
        return null;
    }


    return data;
}

// 카테고리별로 강의실 조회
export const getVenuesByCategory = async (category: Categories): Promise<Venue[] | null> => {
    const { data, error } = await supabase.from('venues').select('*').eq('category', category);

    if (!data) {
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}

// 아이디로 단일 강의실 조회
export const getVenueById = async (id: string): Promise<Venue | null> => {
    const { data, error } = await supabase.from('venues').select('*').eq('id', id).single();

    if (!data) {
        console.error(error, `error! : ${error}`);
        return null;
    }
    return data;
}

// 예약 생성
export const createReservation = async (ipt: CreateReservation): Promise<Reservation | null> => {    
    const { data, error } = await supabase.from('reservations').insert(ipt).select().single();

    
    if (!data) {
        console.error(JSON.stringify(error));
        return null;
    }
    return data;
}