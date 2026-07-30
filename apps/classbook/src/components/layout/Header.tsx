import { auth } from "@/auth";
import { Button } from "@repo/ui";
import Link from "next/link";
import { Container } from "./Container";

function DefaultPart() {
    return (
        <ul className="flex flex-row">
            <li className="cursor-pointer">
                <Link href={`/`}>
                    <h1 className="font-semibold">Classbook</h1>
                </Link>
            </li>
        </ul>
    )
}

export async function Header() {
    const session = await auth();
    const user_id = session?.user?.id;
    return (
        <header className="sticky top-0 h-14 bg-background/80 backdrop-blur-sm z-12">
            <Container className="flex flex-row items-center justify-between h-full">
                <DefaultPart />
                {!user_id ? <Link href={`/login`}><Button size="sm">로그인</Button></Link> : <Link href={`/my`}><Button size="sm">마이페이지</Button></Link>}
            </Container>
        </header>
    )
}