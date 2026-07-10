"use client";

import { ReservationWithVenue, Statuses } from "@/types/database";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Card, CardContent, CardTitle, cn, MembersValue, Badge } from "@repo/ui";
import Link from "next/link";
import { PriceValue } from "../price/PriceValue";
import { LocationLabel } from "../location/LocationLabel";
import {CircleCheck, CircleSlash2, LoaderCircle, LucideIcon } from "lucide-react";
import { cancelReservevationFormMyAction } from "@/actions/reservation";

const STATUS_ICONS: Record<Statuses, LucideIcon> = {
    'CANCELED': CircleSlash2,
    'CONFIRMED': CircleCheck
}

const STATUS_CLASSES: Record<Statuses, string> = {
    'CANCELED': '',
    'CONFIRMED': ''
}

const STATUS_CONTEXTS: Record<Statuses, string> = {
    'CANCELED': '취소됨',
    'CONFIRMED': '예약완료'
}


export function ReservationCard({ reservationWithVenue }: { reservationWithVenue: ReservationWithVenue }) {

    const venue = reservationWithVenue.venues;
    const StatusIcon = STATUS_ICONS[reservationWithVenue.status as Statuses];
    const StatusClass = STATUS_CLASSES[reservationWithVenue.status as Statuses];
    const StatusContext = STATUS_CONTEXTS[reservationWithVenue.status as Statuses];
    
    return (
        <Card className="bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 overflow-hidden">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <Link href={`/venues/${venue.id}`} className="block">
                    <img src={venue.thumbnail_url} alt={`${venue.name}'s thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                </Link>
            </div>
            <CardContent>
                <CardTitle className="flex flex-row justify-items-center gap-2 pb-1">
                    <span className="truncate">{venue.title}</span>
                    <MembersValue capacity={venue.capacity} />
                    <Badge className="gap-1" >
                        <span>{StatusContext}</span>
                        <StatusIcon size={12} className={cn(StatusClass, ' ')} />
                    </Badge>
                </CardTitle>
                <div>
                    <PriceValue value_name="시간당" price={venue.price} />
                    <LocationLabel location={venue.address} />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={reservationWithVenue.status === "CANCELED"}
                                className="flex gap-1 px-4"
                            >
                                <span>{reservationWithVenue.status == "CONFIRMED" ? "예약 취소" : "취소됨" }</span>
                            </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="max-w-sm">
                            <AlertDialogHeader className="text-left">
                                <AlertDialogTitle>정말 예약을 취소할까요?</AlertDialogTitle>
                                <AlertDialogDescription>해당 양식은 제거됩니다.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex flex-row items-center justify-end gap-4">
                                <AlertDialogCancel className="mt-0 border-border border-1">아니오</AlertDialogCancel>
                                <AlertDialogAction className="" onClick={()=>{cancelReservevationFormMyAction(reservationWithVenue.id)}}>취소하기</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}