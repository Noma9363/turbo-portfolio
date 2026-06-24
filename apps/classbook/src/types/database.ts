export interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    created_at: string;
}

export type Categories = "SINGLE" | "DOUBLE" | "MEETING" | "LECTURE";

export type Statuses = "WAITING" | "CONFIRMED" | "CANCELED";

export interface Venue {
    id: string;
    name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    thumbnail_url: string;
    price: number;
    title: string;
    sub_title: string;
    body: string;
    capacity: number;
    operating_hours: string;
    category: Categories;
    amenities: string[];
    tags: string[];
}

export interface Reservation {
    id: string;
    user_id: string;
    venue_id: string;
    name: string;
    phone: string;
    email: string;
    start_at: string;
    end_at: string;
    members: number;
    purpose: string;
    request: string;
    status: Statuses;
}

export interface Favorite{
    id: string;
    user_id: string;
    venue_id: string;
}