import express from 'express';
import { ProductAttributeController } from '../controllers/ProductAttributeController';

const router = express.Router();
const productAttributeController = new ProductAttributeController();
// Attribute routes
router.post('/:productId/attributes', (req, res) => productAttributeController.addProductAttribute(req, res));
router.get('/:productId/attributes', (req, res) => productAttributeController.getProductAttributes(req, res));
router.put('/attributes/:attributeId', (req, res) => productAttributeController.updateProductAttribute(req, res));
router.delete('/attributes/:attributeId', (req, res) => productAttributeController.deleteProductAttribute(req, res));

export default router;
