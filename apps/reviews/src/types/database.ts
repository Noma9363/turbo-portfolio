export interface user {
    id: string; // 유저의 id
    email: string; // 이메일
    name: string; // 닉네임
    avatar_url?: string; // 아바타 없을수도있음
    created_at: string; // Date 타입을 받고 string 처리?
}

// 카테고리의 경우 지금 단순하게 해야할지 아니면 뎁스로 해야할지 고민중
export type categories = "headphone" | "earphone" | "dac" | "amp";

// 타입과 상수 
export const CATEGORIES: categories[] = ["headphone", "earphone", "dac", "amp"];

export interface products {
    id: string; // 상품의 고유 id
    name: string; // 상품명
    category: categories; // 카테고리 타입 활용
    image_url?: string; // 이미지 없을 수도 있음
    description?: string; // 초기 설명 비어있을 수 있음
    label?: string[]; // 상품의 특징 레이블, 초기상품 레이블 없을 수 있음
    price: number; // 가격 미정이거나 출시 이전일 수 있음
}


export interface reviews {
    id: string; // 리뷰의 고유 id
    user_id: string; // 리뷰한 고객 고유 id
    product_id: string; // 상품 고유 id
    rating: number; // 점수
    title: string; // 제목
    body: string; // 해당 body 의 경우 React.ReactNode 로 해야할지 string 으로 해야할지..
    created_at: string; // Date 타입을 받고 string 처리?
    updated_at: string; // Date 타입을 받고 string 처리?
}

// 해당 likes 는 어떻게 활용하는지 모르겠음
export interface likes {
    id: string;
    user_id: string;
    review_id: string;
}

export interface ReviewWithProduct extends reviews{
    products: Pick<products, 'id' | 'name' | 'category' | 'image_url' | 'description' | 'label' | 'price' >;
}

export type CreateReviewInput = Omit<reviews, 'id' | 'created_at' | 'updated_at'>;