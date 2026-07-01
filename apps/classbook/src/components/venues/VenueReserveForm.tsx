"use client";

import { Venue } from "@/types/database";
import { Button, Calendar, Card, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input, Popover, PopoverContent, PopoverTrigger, Progress } from "@repo/ui";
import { useState } from "react";

interface Props {
    venue: Venue;
}

export function VenueReserveForm({ venue }: Props) {
    const [open, setOpen] = useState<boolean>(false);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [progress, setProgress] = useState<number>(0);
    
    return (
        <article>
            <Card className="px-4 py-6">
                <form action={""}>
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
                                    <Input id="form_name" name="title" placeholder="이름을 적어주세요" required />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_phone">
                                        연락처
                                    </FieldLabel>
                                    <Input id="form_phone" name="title" placeholder="010-0000-0000" required />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_email">
                                        이메일
                                    </FieldLabel>
                                    <Input id="form_email" name="title" placeholder="이름을 적어주세요" required />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_start_at">
                                        시작일
                                    </FieldLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline">
                                                {date ? date.toLocaleDateString() : '날짜 선택'}
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
                                    <div className="flex text-nowrap items-center gap-4">

                                        <div className="flex-1 flex flex-col gap-1">

                                            <FieldLabel className="font-semibold pl-1" htmlFor="form_start_at">
                                                부터
                                            </FieldLabel>
                                            <Input
                                                type="time"
                                                id=""
                                                step={1}
                                                defaultValue={'00:00:00'}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                            />

                                        </div>

                                        <div className="flex-1 flex flex-col gap-1">

                                            <FieldLabel className="font-semibold  pl-1" htmlFor="form_start_at">
                                                까지
                                            </FieldLabel>
                                            <Input
                                                type="time"
                                                id=""
                                                step={1}
                                                defaultValue={'00:00:00'}
                                                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                            />

                                        </div>
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_email">
                                        인원
                                    </FieldLabel>
                                    <Input type="number" id="form_email" name="title" placeholder="0" required />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_email">
                                        목적
                                    </FieldLabel>
                                    <Input type="number" id="form_email" name="title" placeholder="0" required />
                                </Field>
                                <Field>
                                    <FieldLabel className="font-semibold" htmlFor="form_email">
                                        요청 사항
                                    </FieldLabel>
                                    <Input type="number" id="form_email" name="title" placeholder="0" required />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldLabel className=" w-full flex justify-between items-center">
                            <span>
                                
                                {
                                    progress === 0
                                    ? "작성중"
                                    : progress === 50
                                    ? "예약중"
                                    : "예약 완료"
                                }
                            </span>
                            <span>{progress}%</span>
                        </FieldLabel>
                        <Progress value={progress} className="w-[60%] h-1"/>
                    </FieldGroup>
                        
                </form>
            </Card>
        </article>
    );
}
