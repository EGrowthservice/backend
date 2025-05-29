import { Router } from 'express';
import authOAuth from './authOAuth';
import authRoutes from './authRoutes';
import utilsRoutes from './utilsRoutes';
import paymentRoutes from './payment';

const router = Router();

router.use('/authSocial', authOAuth);
router.use('/auth', authRoutes);
router.use('/utils', utilsRoutes);
router.use('/payment', paymentRoutes);

export default router;
