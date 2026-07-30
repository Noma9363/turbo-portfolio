import { auth } from "@/auth";
import { Container } from "@/components/layout/Container";
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
            <Container>
                <section>
                    <VenueDetail venue={venue!} />
                    <VenueReserveForm venue={venue!} existingReservation={existingReservation}/>
                </section>
            </Container>
        </div>
    )
}