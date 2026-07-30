"use client";

import { Button, Card, CardContent, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@repo/ui";
import { Frame } from "lucide-react";

interface VenuGalleryDialogProps{
    images: string[];
}

export function VenuGalleryDialog({images}:VenuGalleryDialogProps){
    return(
        <Dialog>
            <DialogTrigger asChild className="absolute right-2 bottom-2">
                <Button variant="secondary" size="sm" className="bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm">
                    <Frame size={12}/>사진보기
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-xl p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>list of images</DialogTitle>
                </DialogHeader>
                <Carousel className="overflow-visible relative">
                    <CarouselContent className="p-0">
                        {images.map((img_item,  idx)=>(<CarouselItem key={`${img_item}-${idx}`}>
                            <div className="p-0">
                                <Card className="overflow-hidden">
                                    <CardContent className="p-0">
                                        <img src={img_item} alt={`images of list`} className="w-full h-fit aspect-video object-cover" />
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2  bg-black/50 text-white"/>
                    <CarouselNext className="right-2  bg-black/50 text-white"/>
                </Carousel>
            </DialogContent>
        </Dialog>
    )
}