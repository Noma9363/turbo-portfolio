import { VenueCard } from "@/components/venunes/VenueCard";
import { VenueList } from "@/components/venunes/VenuList";
import { getVenues } from "@/queries/venues";

export default async function Page() {
    const venues = await getVenues();

    if(venues === null){
        return(
            <div>
                There's No Venues Presnt
            </div>
        )
    }
    
    
    return(
        <div>
            <VenueList venues={venues}/>
        </div>
    )
}