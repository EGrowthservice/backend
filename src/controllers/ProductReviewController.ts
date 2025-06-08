import { Request, Response } from 'express';
import { ProductReviewService } from '../services/ProductReview';
import { ApiResponseHandler } from '../utils/response';
import { ProductReview } from '../types/ProductReview';
import { User } from '../types/user';
export class ProductReviewController {
    private productReviewService: ProductReviewService;

    constructor() {
        this.productReviewService = new ProductReviewService();
    }

    public async createReview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ApiResponseHandler.error('User not authenticated'));
                return;
            }

            const productId = req.params.productId;
            const user = req.user as User;
            const reviewData: ProductReview = {
                ...req.body,
                product_id: parseInt(productId),
                user_id: user.id
            };

            const newReview = await this.productReviewService.createReview(reviewData);
            res.status(201).json(ApiResponseHandler.success(newReview, 'Review created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating review', error));
        }
    }

    public async getProductReviews(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const reviews = await this.productReviewService.getProductReviews(productId);
            res.status(200).json(ApiResponseHandler.success(reviews, 'Reviews retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving reviews', error));
        }
    }

    public async updateReview(req: Request, res: Response): Promise<void> {
        try {
            if (!req.user) {
                res.status(401).json(ApiResponseHandler.error('User not authenticated'));
                return;
            }

            const reviewId = req.params.reviewId;
            const productId = req.params.productId;
            const user = req.user as User;
            const reviewData: ProductReview = {
                ...req.body,
                product_id: parseInt(productId),
                user_id: user.id
            };



            const updatedReview = await this.productReviewService.updateReview(reviewId, reviewData);
            res.status(200).json(ApiResponseHandler.success(updatedReview, 'Review updated successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating review', error));
        }
    }

    public async deleteReview(req: Request, res: Response): Promise<void> {
        try {
            const reviewId = req.params.reviewId;
            await this.productReviewService.deleteReview(reviewId);
            res.status(200).json(ApiResponseHandler.success(null, 'Review deleted successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting review', error));
        }
    }
}