import { Router } from 'express';
import { register, login, verifyEmail, forgotPassword, resetPassword, changePassword } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
// router.post('/', authenticate, hasRole(['admin']), upload.single('file'), uploadProject);


export default router;