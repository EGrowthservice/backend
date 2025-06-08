import { Request, Response } from 'express';
import { ProductService } from '../services/product';
import { Product } from '../types/product';
import { ApiResponseHandler } from '../utils/response';

export class ProductController {
    private productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    public async createProduct(req: Request, res: Response): Promise<void> {
        try {
            const productData: Product = req.body;
            const newProduct = await this.productService.createProduct(productData);
            res.status(201).json(ApiResponseHandler.success(newProduct, 'Product created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating product', error));
        }
    }

    public async getProducts(req: Request, res: Response): Promise<void> {
        try {
            const products = await this.productService.getProducts();
            res.status(200).json(ApiResponseHandler.success(products, 'Products retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving products', error));
        }
    }

    public async getProductById(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const product = await this.productService.getProductById(productId);
            if (product) {
                res.status(200).json(ApiResponseHandler.success(product, 'Product found'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Product not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving product', error));
        }
    }

    public async updateProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const productData: Product = req.body;
            const updatedProduct = await this.productService.updateProduct(productId, productData);
            if (updatedProduct) {
                res.status(200).json(ApiResponseHandler.success(updatedProduct, 'Product updated successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Product not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating product', error));
        }
    }

    public async deleteProduct(req: Request, res: Response): Promise<void> {
        try {
            const productId = req.params.id;
            const deleted = await this.productService.deleteProduct(productId);
            if (deleted) {
                res.status(200).json(ApiResponseHandler.success(null, 'Product deleted successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Product not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting product', error));
        }
    }


}