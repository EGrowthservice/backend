import { supabase } from '../config/supabase';
import { Category } from '../types/category';
import { v4 as uuidv4 } from 'uuid';

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
        // Remove associated image from storage if exists
        const category = await this.getCategoryById(id);
        if (category.image_url) {
            const fileName = category.image_url.split('/').pop();
            if (fileName) {
                await supabase.storage
                    .from('category-images')
                    .remove([`categories/${fileName}`]);
            }
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }

    async uploadCategoryImage(file: Express.Multer.File, categoryId: string): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${categoryId}/${uuidv4()}.${fileExtension}`;

        const { data, error } = await supabase.storage
            .from('category-images')
            .upload(`categories/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
            });

        if (error) throw error;

        // Get public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
            .from('category-images')
            .getPublicUrl(`categories/${fileName}`);

        // Update category with image URL
        await this.updateCategory(categoryId, { image_url: publicUrl });

        return publicUrl;
    }
}