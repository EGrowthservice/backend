export interface ProductVariant {
    id?: number;
    product_id: number;
    sku: string;
    variant_name: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}