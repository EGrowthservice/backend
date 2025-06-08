import { ProductAttribute } from '../types/ProductAttribute';
import { ProductReview } from '../types/ProductReview';
import { supabase } from '../config/supabase';

export class ProductAttributeService {
    public async addProductAttribute(attribute: ProductAttribute) {
        const { data, error } = await supabase
            .from('product_attributes')
            .insert([attribute])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async getProductAttributes(productId: string) {
        const { data, error } = await supabase
            .from('product_attributes')
            .select('*')
            .eq('product_id', productId);

        if (error) throw error;
        return data;
    }

    public async updateProductAttribute(attributeId: string, attributeData: Partial<ProductAttribute>) {
        const { data, error } = await supabase
            .from('product_attributes')
            .update(attributeData)
            .eq('id', attributeId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteProductAttribute(attributeId: string) {
        const { error } = await supabase
            .from('product_attributes')
            .delete()
            .eq('id', attributeId);

        if (error) throw error;
        return true;
    }

    // Review methods
    public async createReview(review: ProductReview) {
        const { data, error } = await supabase
            .from('product_reviews')
            .insert([review])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async getProductReviews(productId: string) {
        const { data, error } = await supabase
            .from('product_reviews')
            .select(`
            *,
            user:user_id (
                id,
                email,
                name
            )
        `)
            .eq('product_id', productId);

        if (error) throw error;
        return data;
    }

    public async updateReview(reviewId: string, reviewData: Partial<ProductReview>) {
        const { data, error } = await supabase
            .from('product_reviews')
            .update(reviewData)
            .eq('id', reviewId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteReview(reviewId: string) {
        const { error } = await supabase
            .from('product_reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;
        return true;
    }
}