import { auth } from "@/auth";
import { VenuGallery } from "@/components/venues/VenuGallery";
import { VenueDetail } from "@/components/venues/VenueDetail";
import { VenueReserveForm } from "@/components/venues/VenueReserveForm";
import { getReservationByVenueAndUser, getVenueById } from "@/queries/venues";


export default async function Page({ params }: { params: Promise<{id: string}> }) {

    const {id} = await params;
    const venue = await getVenueById(id);
    const session = await auth();
    const user_id = session?.user?.id;
    const existingReservation = (user_id) ? await getReservationByVenueAndUser(venue!.id, user_id) : null;

    return (
        <div>
            <VenuGallery images={venue!.images} />
            <div className="max-w-[1276px] mx-auto px-4">
                <section>
                    <VenueDetail venue={venue!} />
                    <VenueReserveForm venue={venue!} existingReservation={existingReservation}/>
                </section>
            </div>
        </div>
    )
}