import { supabase } from '../config/supabase';
import { Category } from '../types/category';

export class CategoryService {
    async createCategory(categoryData: Category) {
        const { data, error } = await supabase
            .from('categories')
            .insert([categoryData])
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async getCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*, parent:parent_id(id, name)');

        if (error) throw error;
        return data;
    }

    async getCategoryById(id: string) {
        const { data, error } = await supabase
            .from('categories')
            .select('*, parent:parent_id(id, name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    }

    async updateCategory(id: string, categoryData: Partial<Category>) {
        const { data, error } = await supabase
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    async deleteCategory(id: string) {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}