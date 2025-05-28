import { Router, Request, Response } from 'express';
import passport from 'passport';
import { sendWelcomeEmail } from '../utils/sendEmail';
import jwt from 'jsonwebtoken';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    async (req: Request, res: Response) => {
        const user = req.user as any;
        await sendWelcomeEmail(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${user.token}`);
    }
);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    async (req: Request, res: Response) => {
        const user = req.user as any;
        await sendWelcomeEmail(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${user.token}`);
    }
);

// Lấy thông tin người dùng
router.get('/me', (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Không có token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
});

// Gửi email test
router.post('/send-test-email', async (req: Request, res: Response) => {
    const { email, name } = req.body;
    await sendWelcomeEmail(email, name);
    res.json({ message: 'Email đã được gửi' });
});

export default router;