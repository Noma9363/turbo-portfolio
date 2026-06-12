"use client"
import { products } from "@/types/database";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, Badge } from "@repo/ui";

export function ProductCard({ product }: { product: products }) {
    return (
        <Card>
            <CardHeader>
                <p>
                    <span>{product.category}</span>
                </p>
                <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {product.image_url && <img src={product.image_url} alt={product.name} />
                }
                <p>{product.description}</p>
            </CardContent>
            <CardFooter>
                <p>{product.price}</p>
                {
                    product.label?.map((l) => (<Badge key={l}>{l}</Badge>))
                }
            </CardFooter>
        </Card>
    )
}