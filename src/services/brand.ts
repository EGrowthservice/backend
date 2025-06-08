import { supabase } from '../config/supabase';
import { Brand } from '../types/brand';

export class BrandService {
    async createBrand(brandData: Brand) {
        const { data, error } = await supabase
            .from('brands')
            .insert([brandData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getBrands() {
        const { data, error } = await supabase
            .from('brands')
            .select('*');

        if (error) throw error;
        return data;
    }

    async getBrandById(id: string) {
        const { data, error } = await supabase
            .from('brands')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateBrand(id: string, brandData: Partial<Brand>) {
        const { data, error } = await supabase
            .from('brands')
            .update(brandData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteBrand(id: string) {
        const { error } = await supabase
            .from('brands')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}