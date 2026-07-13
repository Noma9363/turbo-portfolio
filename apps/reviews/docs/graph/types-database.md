---
tags: [reviews, types]
---

# types/database.ts

🔗 [GitHub](https://github.com/Noma9363/turbo-portfolio/blob/main/apps/reviews/src/types/database.ts)

상위: [[reviews/graph/types|types/]]

## 타입 / 인터페이스

| 이름                  | 한 줄 요약                                                                          |
| ------------------- | ------------------------------------------------------------------------------- |
| `user`              | `ReviewWithUser`에서 `Pick<user, 'name'>`으로 이름 필드만 추출해 활용                         |
| `categories`        | `FilterBar.tsx` searchParams 를 통한 상품 필터처리에 활용                                   |
| `products`          | `product` 조회 및 렌더에 활용                                                           |
| `reviews`           | `review` 조회 및 렌더에 활용                                                            |
| `likes`             | 특정 `review` 의 좋아요 상태, `id` 그리고 `user_id`, `review_id` 필드 존재                     |
| `ReviewWithProduct` | `/reviews` 목록에서 product 정보 join 용도로 설계했으나 현재 미사용 (`getAllReviews` 미사용)          |
| `CreateReviewInput` | DB 자동 생성 필드(`id, created_at, updated_at`)을 제외하고 폼 입력값만 받기위해 `Omit` 으로 특정 속성 제외  |
| `ReviewWithUser`    | `/reviews/[id]` 상세는 product를 별도 fetch하므로 `user.name`만 필요해서 `ReviewWithUser`로 분리 |
