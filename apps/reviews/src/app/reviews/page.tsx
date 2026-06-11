import {getAllReviews} from "@/queries/reviews";

interface SearchParamsInterface {
    category?: string;
    sort?: string;
}
export default async function Page({searchParams}: {searchParams: SearchParamsInterface}) {

    const reviews = await getAllReviews();
    if(!reviews || !reviews.length){

        return(
            <div>
                ERROR Review Preserve Failed
            </div>
        )
    }

    return (
        <div>reviewResult is {reviews?.length}</div>
    )
}