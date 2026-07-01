import { VenuGalleryDialog } from "./VenuGalleryDialog";

interface VenuGalleryProps {
    images: string[]
}

export function VenuGallery({ images }: VenuGalleryProps) {

    return (
        <div className="grid grid-cols-3 gap-1">
            <section className="col-span-2">
                <div>
                    <img src={images[0]} alt={`${images}'s thumbnail`} />
                </div>
            </section>
            <section className="col-span-1 grid grid-cols-2 gap-1 h-full">
                {Array.from(images.entries()).map(([idx, item]) => {
                    const oneBaseIdx = idx + 1;
                    if (oneBaseIdx >= 4) {
                        return (
                            <div key={`${item}`} className="relative overflow-hidden">
                                <img src={item} alt={`${item[oneBaseIdx]}'s image`} className="w-full h-full object-cover"/>
                                <VenuGalleryDialog images={images}/>
                            </div>
                        )
                    }
                    return (<div key={`${item}`} className="relative overflow-hidden"><img src={item} alt={`${item[oneBaseIdx]}'s image`} className="w-full h-full object-cover"/></div>)
                })}
            </section>
        </div>
    )
}