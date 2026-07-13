import { auth } from "@/auth"
import { ReservationCard } from "@/components/venues/ReservationCard";
import { VenueCard } from "@/components/venues/VenueCard";
import { VenueList } from "@/components/venues/VenuList";
import { getFavoriteVenuesByUser, getReservationsByUser } from "@/queries/venues";
import { Avatar, AvatarFallback, Card, CardContent, CardDescription, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui"

export default async function Page() {
    const session = await auth();
    const user = session?.user;
    const favoriteVanues = user?.id ? await getFavoriteVenuesByUser(user.id) : null;
    const reservations = user?.id ? await getReservationsByUser(user.id) : null;

    return (
        <div className="p-4">
            <Card className="ring-foreground/10 relative flex flex-col gap-6 rounded-xl text-sm shadow-xs border-none ">
                <div className="h-32 relative bg-cover bg-center rounded-t-xl bg-gradient-to-r from-zinc-800 to-zinc-700">

                </div>
                <div className="pb-6">
                    <Avatar className="size-24 absolute -translate-y-2/3 left-6">
                        <AvatarFallback className="text-2xl font-semibold">
                            {user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-4 px-6 pt-12">
                        <div className="flex flex-col items-start justify-center gap-2">
                            {/* TODO: insert user.name */}
                            <h3 className="text-2xl font-semibold">{user?.name}</h3>
                            <h4 className="text-xl font-extralight">{user?.email}</h4>
                        </div>
                    </div>
                </div>
            </Card>

            {/* tab */}
            <Tabs defaultValue="favorites" className="mt-2">
                <TabsList>
                    <TabsTrigger value="favorites">찜</TabsTrigger>
                    <TabsTrigger value="reservations">예약</TabsTrigger>
                </TabsList>
                <TabsContent value="favorites">
                    <Card>
                        <CardHeader>
                            <CardTitle>찜 목록</CardTitle>
                            <CardDescription>강의실 찜 목록한 내역이에요.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <h3 className="pb-4">
                                {/* TODO: get favorites length */}
                                현재 { favoriteVanues?.length } 건
                            </h3>
                            {/* TODO: render favorites card items */}
                            <div className="flex flex-col gap-4">
                                {favoriteVanues?.map((fv)=>(<VenueCard key={fv.id} isFavorited={true} venue={fv} view="grid"/>))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reservations">
                    <Card>
                        <CardHeader>
                            <CardTitle>예약 내역</CardTitle>
                            <CardDescription>예약된 강의실 내역입니다.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>
                                {/* TODO: get reservations length */}
                                현재 {reservations?.length} 건
                            </p>
                            {/* TODO: render reservations card items */}
                            <div className="">
                                {reservations?.map((r)=>(<ReservationCard key={r.venue_id} reservationWithVenue={r} />))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>

        </div>
    )
}