"use client";

import { useRef, useState } from "react";
import { VenueDetailNav } from "./VenueDetailNav";
import { Venue } from "@/types/database";
import { Car, CircleHelp, HdmiPort, LucideIcon, MapPin, Presentation, Refrigerator, Wifi, Wind } from "lucide-react";
import { Card } from "@repo/ui";
import { KakaoMap } from "../map/KakaoMap";

interface VenueDetailContentProps {
    venue: Venue;
}

const TABS = [
    { id: "description", label: "공간 소개" },
    { id: "amenities", label: "편의시설" },
    { id: "info", label: "시설 정보" },
    { id: "location", label: "위치" },
];

const AMENITY_ICONS: Record<string, LucideIcon> = {
    'WiFi': Wifi,
    '에어컨': Wind,
    '냉장고': Refrigerator,
    '화이트보드': Presentation,
    'HDMI': HdmiPort,
    '주차': Car
}

export function VenueDetailContent({ venue }: VenueDetailContentProps) {
    const [activeId, setActiveId] = useState<string>("description");


    const INFO_ITEMS = [
        { label: '최대 인원', value: `${venue.capacity} 명` },
        { label: '운영 시간', value: `${venue.operating_hours}` },
        { label: '시간당 가격', value: `${venue.price.toString()} 원` },
        { label: '공간 유형', value: `${venue.category}` },
    ]

    const handleTabClick = (id: string) => {
        const el = document.getElementById(id);
        if(!el) return;
        const offset = 14 * 4 * 2;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        setActiveId(id);
        window.scrollTo({top, behavior: 'smooth'});
    }



    return (
        <>
            <VenueDetailNav tabs={TABS} activeId={activeId} onTabClick={(id) => { handleTabClick(id) }} />
            <section id="description" className="pt-4 min-h-96">
                <h3 className="pt-8 pb-3 text-base font-semibold">공간 소개</h3>
                <p className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">{venue.body}</p>
            </section>
            <section id="amenities" className="pb-12 max-w-md ">
                <h3 className="pt-8 pb-3 text-base font-semibold">편의시설</h3>
                <div className="flex flex-row gap-4">

                    {venue.amenities?.map((a) => {
                        const Icon = AMENITY_ICONS[a] ?? CircleHelp;
                        return (
                            <Card key={a} className="aspect-square w-14 relative flex-none">
                                <Icon size={20} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-nowrap text-xs text-muted-foreground">{a}</span>
                            </Card>
                        )
                    })}
                </div>
            </section>
            <section id="info" className="min-h-96">
                <h3 className="pt-8 pb-3 text-base font-semibold">시설 정보</h3>

                <dl className="">
                    {INFO_ITEMS.map((i, idx) => (
                        <div className="gap-2 border-b border-border py-3 flex" key={`${idx}-${i.label}`}>
                            <dt className="w-1/3 gap-2 flex justify-start items-center">
                                <span className="inline-flex justify-center items-center w-5 h-5 aspect-square border border-border rounded-sm text-xs text-muted-foreground">
                                    {(idx + 1)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    {i.label}
                                </span>
                            </dt>
                            <dd className="text-sm font-medium">
                                {i.value}
                            </dd>
                        </div>))}
                </dl>

            </section>
            <section id="location" className="min-h-96">
                <h3 className="pt-8 pb-3 text-base font-semibold">위치</h3>
                <p className="flex justify-start items-center gap-1">
                    <span><MapPin size={14}/></span>
                    <span>{venue.address}</span>
                </p>
                <div className="pt-2">
                    <KakaoMap address={venue.address}/>
                </div>
            </section>
        </>
    );
}
