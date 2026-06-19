import { ReviewWithUser } from "@/types/database";

const reviewsLength = (param: ReviewWithUser[] | null): number => {
    return param?.length ?? 0;
}

export const reviewAvg = (param: ReviewWithUser[] | null): number => {
    const reviewsLen = reviewsLength(param);
    return (reviewsLen > 0
        ? param!.reduce((sum, r) => sum + r.rating, 0) / reviewsLen
        : 0);


}