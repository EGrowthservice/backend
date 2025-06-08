import express from 'express';
import { BrandController } from '../controllers/brandController';

const router = express.Router();
const brandController = new BrandController();

router.post('/', (req, res) => brandController.createBrand(req, res));
router.get('/', (req, res) => brandController.getBrands(req, res));
router.get('/:id', (req, res) => brandController.getBrandById(req, res));
router.put('/:id', (req, res) => brandController.updateBrand(req, res));
router.delete('/:id', (req, res) => brandController.deleteBrand(req, res));

export default router;