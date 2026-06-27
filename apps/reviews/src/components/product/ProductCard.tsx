import { products } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge, cn } from "@repo/ui";
import Link from "next/link";

export function ProductCard({ product }: { product: products }) {
    return (
        <Link href={`reviews/${product.id}`} className="block">
        <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300 h-full flex flex-col")}>
            <CardHeader className="flex flex-col p-4">
                <Badge className="w-fit px-2 mb-4">
                    {product.category}
                </Badge>
                <CardTitle className="">
                    {product.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col px-4 pb-4 flex-1">
                {product.image_url &&
                <div className="w-full aspect-square bg-background overflow-hidden rounded-md ring-1 ring-border">
                    <img className="w-full h-full object-contain" src={product.image_url} alt={product.name} />
                </div>
                }
                <p className="pt-4 text-sm text-muted-foreground line-clamp-3">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 flex flex-row gap-2 mt-auto">
                <p className="font-semibold">${product.price}</p>
                {
                    product.label?.map((l, idx) => (<Badge className={`px-2 whitespace-nowrap ${idx >= 2 ? 'hidden md:inline-flex' : ''}`} key={l}>{l}</Badge>))
                }
            </CardFooter>
        </Card>
        </Link>
    )
}