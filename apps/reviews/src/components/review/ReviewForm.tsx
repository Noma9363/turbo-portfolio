"use client";

import { createReviewAction } from "@/actions/reviews";
import { Button, Card, Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, Input, Rating, Textarea } from "@repo/ui";
import { useState } from "react";
export interface ReviewFormProps {
    productId: string;
    onCancel?: ()=>void;
}
export function ReviewForm({ productId, onCancel }: ReviewFormProps) {

    const [starCount, setStartCount] = useState(3);

    return (

        <Card className="bg-card p-8">
            <form action={createReviewAction}>
                <input type="hidden" name="product_id" value={productId} />
                <FieldGroup className="flex flex-col gap-4">
                    <FieldSet>
                        <FieldLegend>
                            Create Review
                        </FieldLegend>
                        <FieldDescription className="mb-4">
                            this is Create Reivew form
                        </FieldDescription>
                        <FieldGroup>
                            {/* field-1 */}
                            <Field>
                                <FieldLabel htmlFor="form_title">
                                    제목
                                </FieldLabel>
                                <Input
                                    id="form_title"
                                    name="title"
                                    placeholder="evil rabbit"
                                    required
                                />
                            </Field>

                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel id="rating">Rating</FieldLabel>
                                <Rating size={24} precision={1} value={starCount} onValueChange={setStartCount} />
                                <input type="hidden" name="rating" value={starCount} />

                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="body">본문</FieldLabel>
                                <Textarea
                                    id="body"
                                    name="body"
                                    placeholder="Add any additional comments"
                                    className="resize-none"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button onClick={onCancel} variant="outline">Cancel</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Card>
    )
}