import { VenuGallery } from "@/components/venunes/VenuGallery";
import { getVenueById } from "@/queries/venues";


export default async function Page({ params }: { params: Promise<{id: string}> }) {

    const {id} = await params;
    const venue = await getVenueById(id);

    return (
        <div>
                <VenuGallery images={venue!.images} />
        </div>
    )
} 