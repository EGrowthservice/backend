import express from 'express';
import { ProductVariantsController } from '../controllers/productVariantsController';

const router = express.Router();
const productVariants = new ProductVariantsController();

router.post('/:productId/variants', (req, res) => productVariants.createProductVariant(req, res));
router.get('/:productId/variants', (req, res) => productVariants.getProductVariants(req, res));
router.get('/variants/:variantId', (req, res) => productVariants.getVariantById(req, res));
router.put('/variants/:variantId', (req, res) => productVariants.updateVariant(req, res));
router.delete('/variants/:variantId', (req, res) => productVariants.deleteVariant(req, res));

export default router;
