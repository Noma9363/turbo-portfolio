"use server";

import { auth } from "@/auth";
import { createReservation, removeReservationById } from "@/queries/venues";
import { CreateReservation, Reservation } from "@/types/database";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const createReserveAction = async (prevState: { success: boolean | undefined }, formData: FormData) => {

    const session = await auth(); // 세션을 통해 유저 정보 및 로그인 여부 체크
    const user_id = session?.user?.id;
    const prev_url = (await headers()).get('referer');
    if (!user_id) {
        redirect(`/login?callbackUrl=${prev_url}`);
    }
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const date = formData.get('date') as string;
    const curr_start_time = formData.get('start_time') as string;
    const curr_end_time = formData.get('end_time') as string;
    const members = Number(formData.get('members'));
    const purpose = formData.get('purpose') as string;
    const request = formData.get('request') as string;
    const venue_id = formData.get('venue_id') as string;

    if (!user_id || !name || !phone || !email || !date || !curr_start_time || !curr_end_time || !members) return { success: false }; // 필수 정보 없을시 리턴

    const start_at = new Date(`${date}T${curr_start_time}`).toISOString();
    const end_at = new Date(`${date}T${curr_end_time}`).toISOString();


    const input: CreateReservation = { user_id, name, phone, email, start_at, end_at, members, purpose, request, venue_id }; // form 필드 name 양식대로 적기

    const result = await createReservation(input);
    revalidatePath(`/venues/${venue_id}`);
    redirect(`/venues/${venue_id}`);
    return result ? { success: true } : { success: false };


}

export const cancelReservevationAction = async (reservation_id: string, venue_id: string) => {

    const session = await auth();
    const user_id = session?.user?.id;
    const prev_url = (await headers()).get('referer');

    if (!user_id) {
        redirect(`/login?callbackUrl=${prev_url}`);
    }

    await removeReservationById(reservation_id, user_id);
    revalidatePath(`/venues/${venue_id}`);
    redirect(`/venues/${venue_id}`);


}

export const cancelReservevationFormMyAction = async (reservation_id: string) => {
    const session = await auth();
    const user_id = session?.user?.id;

    await removeReservationById(reservation_id, user_id!);
    revalidatePath(`/my`);
    redirect(`/my`);
}