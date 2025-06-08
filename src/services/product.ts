import { supabase } from '../config/supabase';
import { Product } from '../types/product';

export class ProductService {
    async createProduct(productData: Product) {
        const { data, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) throw error;
        return data;
    }

    async getProductById(id: string) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateProduct(id: string, productData: Partial<Product>) {
        const { data, error } = await supabase
            .from('products')
            .update(productData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteProduct(id: string) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

}