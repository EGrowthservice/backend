import { ProductReview } from '../types/ProductReview';
import { supabase } from '../config/supabase';
export class ProductReviewService {
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