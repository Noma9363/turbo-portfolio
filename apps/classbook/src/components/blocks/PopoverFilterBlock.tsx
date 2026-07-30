"use client";

import {Button, cn, Popover, PopoverContent, PopoverTrigger, Label, Input} from "@repo/ui";
import { useState } from "react";

interface PopoverFilterBlockProps{
    onApply: (localMin: number, localMax: number ) => void;
    triggerClassName?: string;
}

export function PopoverFilterBlock({onApply, triggerClassName}:PopoverFilterBlockProps){
    const [open, setOpen] = useState<boolean>(false);
    const [localMin, setLocalMin] = useState<string>("");
    const [localMax, setLocalMax] = useState<string>("");

    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button className={cn(triggerClassName)}>가격 범위</Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] max-w-sm">
                <div>
                    <div className="flex flex-col gap-1 pb-4">
                        <h4 className="font-semibold">가격 범위</h4>
                        <p className="text-sm ">가격 범위를 입력해주세요</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="grid grid-cols-[3rem_1fr] items-center gap-2">
                            <Label htmlFor="minPrc" className="text-nowrap">최소</Label>
                            <Input
                                id="minPrc"
                                type="number"
                                className="h-8 w-full"
                                placeholder="최소 금액 입력"
                                value={localMin}
                                onChange={(e)=>{
                                    setLocalMin((e.target.value))
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-[3rem_1fr] items-center gap-2">
                            <Label htmlFor="maxPrc" className="text-nowrap">최대</Label>
                            <Input
                                id="maxPrc"
                                type="number"
                                className="h-8 w-full"
                                placeholder="최대 금액 입력"
                                value={localMax}
                                onChange={(e)=>{
                                    setLocalMax((e.target.value))
                                }}
                            />
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="w-full mt-4"
                        onClick={()=>{
                            onApply(Number(localMin), Number(localMax));
                            setOpen(false);
                        }}
                    >적용</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}