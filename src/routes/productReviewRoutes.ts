import express from 'express';
import { ProductReviewController } from '../controllers/ProductReviewController';

const router = express.Router();
const productReviewController = new ProductReviewController();

// Review routes
router.post('/:productId/reviews', (req, res) => productReviewController.createReview(req, res));
router.get('/:productId/reviews', (req, res) => productReviewController.getProductReviews(req, res));
router.put('/reviews/:reviewId', (req, res) => productReviewController.updateReview(req, res));
router.delete('/reviews/:reviewId', (req, res) => productReviewController.deleteReview(req, res));
export default router;
