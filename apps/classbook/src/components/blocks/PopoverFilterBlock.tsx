"use client";

import {Button, Popover, PopoverContent, PopoverTrigger, Label, Input} from "@repo/ui";
import { useState } from "react";

interface PopoverFilterBlockProps{
    onApply: (localMin: number, localMax: number ) => void;
}

export function PopoverFilterBlock({onApply}:PopoverFilterBlockProps){
    const [open, setOpen] = useState<boolean>(false);
    const [localMin, setLocalMin] = useState<string>(""); 
    const [localMax, setLocalMax] = useState<string>("");    

    return(
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button>가격 범위</Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    <div className="flex flex-col gap-1 pb-4">
                        <h4 className="font-semibold">가격 범위</h4>
                        <p className="text-sm ">가격 범위를 입력해주세요</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-start items-center gap-2">
                            <Label htmlFor="minPrc" className="text-nowrap">최소</Label>
                            <Input 
                                id="minPrc"
                                type="number"
                                className="col-span-2 h-8 max-w-fit"
                                placeholder="최소 금액 입력"
                                value={localMin}
                                onChange={(e)=>{
                                    setLocalMin((e.target.value))
                                }}
                            />
                        </div>
                        <div className="flex justify-start items-center gap-2">
                            <Label htmlFor="maxPrc" className="text-nowrap">최대</Label>
                            <Input 
                                id="maxPrc"
                                type="number"
                                className="col-span-2 h-8 max-w-fit"
                                placeholder="최대 금액 입력"
                                value={localMax}
                                onChange={(e)=>{
                                    setLocalMax((e.target.value))
                                }}
                            />
                        </div>
                    </div>
                    <Button onClick={()=>{
                        onApply(Number(localMin), Number(localMax));
                        setOpen(false);
                    }}>적용</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}