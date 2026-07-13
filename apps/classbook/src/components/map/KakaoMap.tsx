"use client";

import { useEffect, useRef } from "react";
declare const kakao: any;

interface KakaoMapProps {
    address: string;
}


export function KakaoMap({ address }: KakaoMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log('KakaoMap.tsx) useEffect 실행');
        if (!mapRef.current) return;
        console.log('mapRef OK');

        const initMap = () => {
            console.log('initMap 실행');
            kakao.maps.load(() => {
                console.log('kakao.map.load 콜백 실행');
                new kakao.maps.services.Geocoder().addressSearch(address,
                    (result: any, status: any) => {
                        if (status === kakao.maps.services.Status.OK) {
                            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                            const options = { center: coords, level: 3 };
                            const map = new kakao.maps.Map(mapRef.current, options);

                            new kakao.maps.Marker({ position: coords, map })
                        }else{
                            console.log('Geocoder 실패', status, result);
                        }
                    }
                )
            });
        };

        if (typeof kakao !== 'undefined') {
            console.log('kakao 이미 있음');
            initMap();
            return;
        }

        console.log('스크립트 동적 추가')
        const script = document.createElement('script');
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services`;
        script.addEventListener('load', initMap);
        document.head.appendChild(script);
        script.addEventListener('error', (e) => console.log('스크립트 로드 실패', e));
    }, [address]);

    return <div ref={mapRef} style={{ width: '100%', height: '400px' }} />
}