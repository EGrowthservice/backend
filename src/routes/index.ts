import { Router } from 'express';
import authOAuth from './authOAuth';
import authRoutes from './authRoutes';
import utilsRoutes from './utilsRoutes';
import paymentRoutes from './payment';
import brandRoutes from './brandRoutes';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import productVariantRoutes from './productVariantsRoute';

const router = Router();

router.use('/authSocial', authOAuth);
router.use('/auth', authRoutes);
router.use('/utils', utilsRoutes);
router.use('/payment', paymentRoutes);
router.use('/brands', brandRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/product', productVariantRoutes);

export default router;
