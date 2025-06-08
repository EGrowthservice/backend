export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    parent_id?: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}