import { Router } from 'express';
import { createPayment, getPaymentStatus } from '../controllers/paymentController';

const router = Router();

router.post('/create', createPayment);
router.get('/status/:orderCode', getPaymentStatus);

export default router;
