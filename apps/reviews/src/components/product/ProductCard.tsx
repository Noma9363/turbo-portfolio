import { products } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge, cn } from "@repo/ui";

export function ProductCard({ product }: { product: products }) {
    return (
        <Card className={cn("bg-card rounded-xl border-border text-card-foreground hover:border-zinc-600 transition-colors duration-300")}>
            <CardHeader className="flex flex-col p-4">
                <Badge className="w-fit px-2 mb-4">
                    {product.category}
                </Badge>
                <CardTitle className="">
                    {product.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col">
                {product.image_url && 
                <img className="my-0 m-auto aspect-video object-cover" src={product.image_url} alt={product.name} />
                }
                <p className="p-4">{product.description}</p>
            </CardContent>
            <CardFooter className="p-4 flex flex-row gap-2">
                <p>{product.price}</p>
                {
                    product.label?.map((l) => (<Badge className="px-2" key={l}>{l}</Badge>))
                }
            </CardFooter>
        </Card>
    )
}