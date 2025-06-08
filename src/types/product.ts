export interface Product {
    id?: number;
    name: string;
    slug: string;
    description?: string;
    meta_title?: string;
    meta_description?: string;
    image_url?: string;
    price: number;
    category_id?: number;
    brand_id?: number;
    is_active?: boolean;
    in_stock?: boolean;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}

