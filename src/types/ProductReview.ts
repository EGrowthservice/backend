export interface ProductReview {
    id?: number;
    product_id: number;
    user_id: string;
    rating: number;
    comment?: string;
    created_at?: string;
}