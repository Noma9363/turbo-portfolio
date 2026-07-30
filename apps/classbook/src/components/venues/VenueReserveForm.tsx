"use client";

import { cancelReservevationAction, createReserveAction } from "@/actions/reservation";
import { Reservation, Venue } from "@/types/database";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, Button, Calendar, Card, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input, Popover, PopoverContent, PopoverTrigger, Progress } from "@repo/ui";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

interface Props {
    venue: Venue;
    existingReservation: Reservation | null;
}

type DefaultDate = {
    date: string,
    start_time: string,
    end_time: string
}

function SubmitButton({ success, existingReservation }: { success: boolean, existingReservation: Reservation | null }) {
    const { pending } = useFormStatus();
    // TODO: Explane this code
    const cancelWithId = existingReservation
        ? cancelReservevationAction.bind(null, existingReservation.id, existingReservation.venue_id)
        : null; 

    const progress = existingReservation ? 100 : success ? 100 : pending ? 50 : 0;
    // TODO : cancel 예약 취소 액션 필요
    return (
        <>
            <span className="block mt-8 text-xs text-muted-foreground">{progress === 0 ? "작성중" : progress === 50 ? "예약중" : "예약 완료"}</span>
            <Progress value={progress} className="w-full h-1 mt-2 mb-4" />
            {
                existingReservation ?
                (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button type="button">예약취소</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>정말 예약을 취소할까요?</AlertDialogTitle>
                            <AlertDialogDescription>해당 양식은 제거됩니다.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>아니오</AlertDialogCancel>
                            <AlertDialogAction onClick={()=>cancelWithId?.()}>취소하기</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>)
                :
                <Button disabled={pending} type="submit">예약하기</Button>
            }
        </>
    )
}

export function VenueReserveForm({ venue, existingReservation }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [date, setDate] = useState<Date | undefined>(existingReservation ? new Date(existingReservation.start_at) : undefined);
    const [state, action] = useActionState(createReserveAction, { success: false })

    const defaultDate: DefaultDate | null = existingReservation ? {
        date: existingReservation.start_at.split(' ')[0] ?? '',
        start_time: existingReservation.start_at.split(' ')[1] ?? '',
        end_time: existingReservation.end_at.split(' ')[1] ?? ''
    } : null;


    return (
        <article className="mt-4">
            <Card className="px-4 py-6">
                <form action={action}>
                    <input type="hidden" name="venue_id" value={venue.id} />
                    <FieldGroup className="flex flex-col gap-4">
                        <FieldSet>
                            <FieldLegend className="font-semibold">{venue.title} 예약</FieldLegend>
                            <FieldDescription className="text-sm">입력사항 확인 후 작성해주세요</FieldDescription>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_name">
                                        성함
                                    </FieldLabel>
                                    <Input id="form_name" name="name" placeholder="이름을 적어주세요" required defaultValue={existingReservation?.name} disabled={!!existingReservation} />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_phone">
                                        연락처
                                    </FieldLabel>
                                    <Input id="form_phone" name="phone" placeholder="010-0000-0000" required defaultValue={existingReservation?.phone} disabled={!!existingReservation} />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_email">
                                        이메일
                                    </FieldLabel>
                                    <Input id="form_email" name="email" placeholder="이메일을 입력해주세요" required defaultValue={existingReservation?.email} disabled={!!existingReservation} />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_start_at">
                                        시작일
                                    </FieldLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="w-full justify-start font-normal" disabled={!!existingReservation}>
                                                {date ? date.toLocaleDateString('ko-KR') : "날짜를 선택해주세요"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={date => {
                                                    setDate(date);
                                                    setOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {date && <input type="hidden" name="date" value={date.toISOString().split('T')[0]} disabled={!!existingReservation} />}
                                    <div className="flex text-nowrap items-center gap-4">
                                        <div className="flex-1 flex flex-col gap-1">
                                            <FieldLabel className="font-semibold pl-1" htmlFor="form_start_time">
                                                부터
                                            </FieldLabel>
                                            <Input
                                                type="time"
                                                id="form_start_time"
                                                name="start_time"
                                                step={1}
                                                defaultValue={(defaultDate?.start_time) ? defaultDate.start_time : '00:00:00'}
                                                disabled={!!existingReservation}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <FieldLabel className="font-semibold pl-1" htmlFor="form_end_time">
                                                까지
                                            </FieldLabel>
                                            <Input
                                                type="time"
                                                id="form_end_time"
                                                name="end_time"
                                                step={1}
                                                defaultValue={(defaultDate?.end_time) ? defaultDate.end_time : '00:00:00'}
                                                disabled={!!existingReservation}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                            />
                                        </div>
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_members">
                                        인원
                                    </FieldLabel>
                                    <Input type="number" id="form_members" name="members" placeholder="0" required defaultValue={existingReservation?.members} disabled={!!existingReservation} />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_purpose">
                                        목적
                                    </FieldLabel>
                                    <Input type="text" id="form_purpose" name="purpose" placeholder="사용 목적을 입력해주세요" required defaultValue={existingReservation?.purpose} disabled={!!existingReservation} />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_request">
                                        요청 사항
                                    </FieldLabel>
                                    <Input type="text" id="form_request" name="request" placeholder="요청 사항을 입력해주세요" defaultValue={existingReservation?.request} disabled={!!existingReservation} />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                    </FieldGroup>
                    <SubmitButton success={state.success} existingReservation={existingReservation} />
                </form>
            </Card>
        </article>
    );
}
