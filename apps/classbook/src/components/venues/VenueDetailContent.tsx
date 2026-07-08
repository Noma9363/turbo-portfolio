"use client";

import { useState } from "react";
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
        const currElById = document.getElementById(id);
        currElById?.scrollIntoView({ behavior: 'smooth' });
    }


    return (
        <>
            <VenueDetailNav tabs={TABS} activeId={activeId} onTabClick={(id) => { setActiveId(id); handleTabClick(id) }} />
            <section id="description">
                <h3>공간 소개</h3>
                <p className="whitespace-pre-line">{venue.body}</p>
            </section>
            <section id="amenities" className="pb-12 max-w-md">
                <h3>편의시설</h3>
                <div className="flex flex-row gap-4">

                    {venue.amenities.map((a) => {
                        const Icon = AMENITY_ICONS[a] ?? CircleHelp;
                        return (
                            <Card key={a} className="aspect-square flex-1 relative">
                                <Icon size={24} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-nowrap">{a}</span>
                            </Card>
                        )
                    })}
                </div>
            </section>
            <section id="info">
                <h3>시설 정보</h3>

                <dl className="">
                    {INFO_ITEMS.map((i, idx) => (
                        <div className="text-nowrap gap-2 inset-ring-zinc-200 border-b-[0.4px] border-x-0 border-t-0 py-1 flex" key={`${idx}-${i.label}`}>
                            <dt className="w-1/5  gap-2 flex justify-start items-center border-r-[0.4px] inset-ring-zinc-200">
                                <span className="text-center inline-flex justify-center items-center w-6 h-6 aspect-square inset-ring-zinc-200 border-[0.4px] rounded-sm">
                                    {(idx + 1)}
                                </span>
                                <span className="text-center">
                                    {i.label}
                                </span>
                            </dt>
                            <dd className="">
                                {i.value}
                            </dd>
                        </div>))}
                </dl>

            </section>
            <section id="location">
                <h3>위치</h3>
                <p className="flex justify-start items-center gap-1">
                    <span><MapPin size={14}/></span>
                    <span>{venue.address}</span>
                </p>
                <div>
                    <KakaoMap lat={venue.latitude} lng={venue.longitude} />
                </div>
            </section>
        </>
    );
}
