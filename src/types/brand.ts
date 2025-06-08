export interface Brand {
    id: number;
    name: string;
    slug: string;
    logo_url?: string;
    description?: string;
}

export type CreateBrandInput = Omit<Brand, 'id'>;

export type UpdateBrandInput = Partial<Omit<Brand, 'id'>>;