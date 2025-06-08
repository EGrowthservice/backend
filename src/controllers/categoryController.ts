import { Request, Response } from 'express';
import { CategoryService } from '../services/category';
import { Category } from '../types/category';
import { ApiResponseHandler } from '../utils/response';

export class CategoryController {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    public async createCategory(req: Request, res: Response): Promise<void> {
        try {
            const categoryData: Category = req.body;
            const newCategory = await this.categoryService.createCategory(categoryData);
            res.status(201).json(ApiResponseHandler.success(newCategory, 'Category created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating category', error));
        }
    }

    public async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const categories = await this.categoryService.getCategories();
            res.status(200).json(ApiResponseHandler.success(categories, 'Categories retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving categories', error));
        }
    }

    public async getCategoryById(req: Request, res: Response): Promise<void> {
        try {
            const categoryId = req.params.id;
            const category = await this.categoryService.getCategoryById(categoryId);
            if (category) {
                res.status(200).json(ApiResponseHandler.success(category, 'Category found'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Category not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving category', error));
        }
    }

    public async updateCategory(req: Request, res: Response): Promise<void> {
        try {
            const categoryId = req.params.id;
            const categoryData: Category = req.body;
            const updatedCategory = await this.categoryService.updateCategory(categoryId, categoryData);
            if (updatedCategory) {
                res.status(200).json(ApiResponseHandler.success(updatedCategory, 'Category updated successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Category not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating category', error));
        }
    }

    public async deleteCategory(req: Request, res: Response): Promise<void> {
        try {
            const categoryId = req.params.id;
            const deleted = await this.categoryService.deleteCategory(categoryId);
            if (deleted) {
                res.status(200).json(ApiResponseHandler.success(null, 'Category deleted successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Category not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting category', error));
        }
    }
}