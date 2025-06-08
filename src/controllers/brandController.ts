import { Request, Response } from 'express';
import { BrandService } from '../services/brand';
import { Brand } from '../types/brand';
import { ApiResponseHandler } from '../utils/response';

export class BrandController {
    private brandService: BrandService;

    constructor() {
        this.brandService = new BrandService();
    }

    public async createBrand(req: Request, res: Response): Promise<void> {
        try {
            const brandData: Brand = req.body;
            const newBrand = await this.brandService.createBrand(brandData);
            res.status(201).json(ApiResponseHandler.success(newBrand, 'Brand created successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error creating brand', error));
        }
    }

    public async getBrands(req: Request, res: Response): Promise<void> {
        try {
            const brands = await this.brandService.getBrands();
            res.status(200).json(ApiResponseHandler.success(brands, 'Brands retrieved successfully'));
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving brands', error));
        }
    }

    public async getBrandById(req: Request, res: Response): Promise<void> {
        try {
            const brandId = req.params.id;
            const brand = await this.brandService.getBrandById(brandId);
            if (brand) {
                res.status(200).json(ApiResponseHandler.success(brand, 'Brand found'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Brand not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error retrieving brand', error));
        }
    }

    public async updateBrand(req: Request, res: Response): Promise<void> {
        try {
            const brandId = req.params.id;
            const brandData: Brand = req.body;
            const updatedBrand = await this.brandService.updateBrand(brandId, brandData);
            if (updatedBrand) {
                res.status(200).json(ApiResponseHandler.success(updatedBrand, 'Brand updated successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Brand not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error updating brand', error));
        }
    }

    public async deleteBrand(req: Request, res: Response): Promise<void> {
        try {
            const brandId = req.params.id;
            const deleted = await this.brandService.deleteBrand(brandId);
            if (deleted) {
                res.status(200).json(ApiResponseHandler.success(null, 'Brand deleted successfully'));
            } else {
                res.status(404).json(ApiResponseHandler.error('Brand not found'));
            }
        } catch (error) {
            res.status(500).json(ApiResponseHandler.error('Error deleting brand', error));
        }
    }
}