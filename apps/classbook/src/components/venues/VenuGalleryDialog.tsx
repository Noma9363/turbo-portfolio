"use client";

import { Button, Card, CardContent, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui";
import { Frame } from "lucide-react";

interface VenuGalleryDialogProps{
    images: string[];
}

export function VenuGalleryDialog({images}:VenuGalleryDialogProps){
    return(
        <Dialog>
            <DialogTrigger asChild className="absolute right-0 bottom-0">
                <Button variant="outline">
                    <Frame size={12}/>
                </Button>
            </DialogTrigger>
            <DialogContent >
                <DialogHeader className="sr-only">
                    <DialogTitle>list of images</DialogTitle>
                </DialogHeader>
                <Carousel>
                    <CarouselContent>
                        {images.map((img_item,  idx)=>(<CarouselItem key={`${img_item}-${idx}`}>
                            <div className="p-1">
                                <Card>
                                    <CardContent>
                                        <img src={img_item} alt={`images of list`} />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>))}
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </DialogContent>
        </Dialog>
    )
}