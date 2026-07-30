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
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start">
                    <section className="lg:col-span-2">
                        <VenueDetail venue={venue!} />
                    </section>
                    <aside className="lg:col-span-1 lg:sticky lg:top-20">
                        <VenueReserveForm venue={venue!} existingReservation={existingReservation}/>
                    </aside>
                </div>
            </Container>
        </div>
    )
}