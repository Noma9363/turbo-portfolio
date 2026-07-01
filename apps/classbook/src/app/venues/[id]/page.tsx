import { VenuGallery } from "@/components/venues/VenuGallery";
import { VenueDetail } from "@/components/venues/VenueDetail";
import { VenueReserveForm } from "@/components/venues/VenueReserveForm";
import { getVenueById } from "@/queries/venues";


export default async function Page({ params }: { params: Promise<{id: string}> }) {

    const {id} = await params;
    const venue = await getVenueById(id);

    return (
        <div>
            <VenuGallery images={venue!.images} />
            <div className="max-w-[1276px] mx-auto px-4">
                <section>
                    <VenueDetail venue={venue!} />
                    <VenueReserveForm venue={venue!} />
                </section>
            </div>
        </div>
    )
}