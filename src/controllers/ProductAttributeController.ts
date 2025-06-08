import { Request, Response } from 'express';
import { ProductAttributeService } from '../services/ProductAttribute';
import { ApiResponseHandler } from '../utils/response';
import { ProductAttribute } from '../types/ProductAttribute';

export class ProductAttributeController {
    private productService: ProductAttributeService;

    constructor() {
        this.productService = new ProductAttributeService();
    }

    // Add these methods to ProductController class
    public async addProductAttribute(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const attributeData: ProductAttribute = {
                ...req.body,
                product_id: parseInt(productId)
            };
            const newAttribute = await this.productService.addProductAttribute(attributeData);
            res.status(201).json(ApiResponseHandler.success(newAttribute, 'Product attribute added successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error adding product attribute', error));
        }
    }

    public async getProductAttributes(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const attributes = await this.productService.getProductAttributes(productId);
            res.status(200).json(ApiResponseHandler.success(attributes, 'Product attributes retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving product attributes', error));
        }
    }

    public async updateProductAttribute(req: Request, res: Response): Promise<void> {
        try {
            const attributeId = req.params.attributeId;
            const attributeData: Partial<ProductAttribute> = req.body;
            const updatedAttribute = await this.productService.updateProductAttribute(attributeId, attributeData);
            res.status(200).json(ApiResponseHandler.success(updatedAttribute, 'Product attribute updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating product attribute', error));
        }
    }

    public async deleteProductAttribute(req: Request, res: Response): Promise<void> {
        try {
            const attributeId = req.params.attributeId;
            await this.productService.deleteProductAttribute(attributeId);
            res.status(200).json(ApiResponseHandler.success(null, 'Product attribute deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting product attribute', error));
        }
    }

    // Review methods
    public async createReview(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const userId = req.user.id; // Assuming you have user data in request
            const reviewData: ProductReview = {
                ...req.body,
                product_id: parseInt(productId),
                user_id: userId
            };
            const newReview = await this.productService.createReview(reviewData);
            res.status(201).json(ApiResponseHandler.success(newReview, 'Review created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating review', error));
        }
    }

    public async getProductReviews(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const reviews = await this.productService.getProductReviews(productId);
            res.status(200).json(ApiResponseHandler.success(reviews, 'Reviews retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving reviews', error));
        }
    }

    public async updateReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.reviewId;
            const userId = req.user.id;
            const reviewData: Partial<ProductReview> = req.body;
            const updatedReview = await this.productService.updateReview(reviewId, reviewData);
            res.status(200).json(ApiResponseHandler.success(updatedReview, 'Review updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating review', error));
        }
    }

    public async deleteReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.reviewId;
            await this.productService.deleteReview(reviewId);
            res.status(200).json(ApiResponseHandler.success(null, 'Review deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting review', error));
        }
    }
}