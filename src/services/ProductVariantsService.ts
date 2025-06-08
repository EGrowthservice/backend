import { supabase } from '../config/supabase';
import { ProductVariant } from '../types/productVariant';
export class ProductVariantsService {
    public async createProductVariant(variant: ProductVariant) {
        const { data, error } = await supabase
            .from('product_variants')
            .insert([variant])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async getProductVariants(productId: string) {
        const { data, error } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', productId);

        if (error) throw error;
        return data;
    }

    public async getVariantById(variantId: string) {
        const { data, error } = await supabase
            .from('product_variants')
            .select('*')
            .eq('id', variantId)
            .single();

        if (error) throw error;
        return data;
    }

    public async updateVariant(variantId: string, variantData: Partial<ProductVariant>) {
        const { data, error } = await supabase
            .from('product_variants')
            .update(variantData)
            .eq('id', variantId)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    public async deleteVariant(variantId: string) {
        const { error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', variantId);

        if (error) throw error;
        return true;
    }
}