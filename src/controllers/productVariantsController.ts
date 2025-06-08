import { Request, Response } from 'express';
import { ProductVariantsService } from '../services/ProductVariantsService';
import { ProductVariant } from '../types/productVariant';
import { ApiResponseHandler } from '../utils/response';
export class ProductVariantsController {
    private productVariantsService: ProductVariantsService;

    constructor() {
        this.productVariantsService = new ProductVariantsService();
    }
    public async createProductVariant(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const variantData: ProductVariant = {
                ...req.body,
                product_id: parseInt(productId)
            };
            const newVariant = await this.productVariantsService.createProductVariant(variantData);
            res.status(201).json(ApiResponseHandler.success(newVariant, 'Product variant created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating product variant', error));
        }
    }

    public async getProductVariants(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.productId;
            const variants = await this.productVariantsService.getProductVariants(productId);
            res.status(200).json(ApiResponseHandler.success(variants, 'Product variants retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving product variants', error));
        }
    }

    public async getVariantById(req: Request, res: Response): Promise<void> {
        try {
            const variantId = req.params.variantId;
            const variant = await this.productVariantsService.getVariantById(variantId);
            if (variant) {
                res.status(200).json(ApiResponseHandler.success(variant, 'Variant found'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Variant not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving variant', error));
        }
    }

    public async updateVariant(req: Request, res: Response): Promise<void> {
        try {
            const variantId = req.params.variantId;
            const variantData: Partial<ProductVariant> = req.body;
            const updatedVariant = await this.productVariantsService.updateVariant(variantId, variantData);
            if (updatedVariant) {
                res.status(200).json(ApiResponseHandler.success(updatedVariant, 'Variant updated successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Variant not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating variant', error));
        }
    }

    public async deleteVariant(req: Request, res: Response): Promise<void> {
        try {
            const variantId = req.params.variantId;
            const deleted = await this.productVariantsService.deleteVariant(variantId);
            if (deleted) {
                res.status(200).json(ApiResponseHandler.success(null, 'Variant deleted successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Variant not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting variant', error));
        }
    }
}