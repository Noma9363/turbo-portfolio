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
                            리뷰 작성
                        </FieldLegend>
                        <FieldDescription className="mb-4">
                            음향기기 사용 경험을 공유해주세요.
                        </FieldDescription>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="form_title">
                                    제목
                                </FieldLabel>
                                <Input
                                    id="form_title"
                                    name="title"
                                    placeholder="제목을 입력해주세요"
                                    required
                                />
                            </Field>

                        </FieldGroup>
                    </FieldSet>
                    <FieldSet>
                        <FieldGroup>
                            <Field>
                                <FieldLabel id="rating">별점</FieldLabel>
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
                                    placeholder="솔직한 리뷰를 남겨주세요."
                                    className="resize-none"
                                />
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button type="submit">등록</Button>
                        <Button onClick={onCancel} variant="outline">취소</Button>
                    </Field>
                </FieldGroup>
            </form>
        </Card>
    )
}