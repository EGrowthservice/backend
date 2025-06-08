import { Request, Response } from 'express';
import { ProductAttributeService } from '../services/ProductAttribute';
import { ApiResponseHandler } from '../utils/response';
import { ProductAttribute } from '../types/ProductAttribute';

export class ProductAttributeController {
    private productService: ProductAttributeService;

    constructor() {
        this.productService = new ProductAttributeService();
    }

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
}