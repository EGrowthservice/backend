import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/sendEmail';

const JWT_SECRET = process.env.JWT_SECRET!;
const CLIENT_URL = process.env.CLIENT_URL!;
const IS_PROD = process.env.NODE_ENV === 'production';

// ✅ Google OAuth callback
export const googleCallback = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        await sendWelcomeEmail(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: IS_PROD });
        res.redirect(`${CLIENT_URL}/auth/callback?token=${user.token}`);
    } catch (error) {
        res.redirect('/login');
    }
};

// ✅ GitHub OAuth callback
export const githubCallback = async (req: Request, res: Response) => {
    try {
        const user = req.user as any;
        await sendWelcomeEmail(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: IS_PROD });
        res.redirect(`${CLIENT_URL}/auth/callback?token=${user.token}`);
    } catch (error) {
        res.redirect('/login');
    }
};

// ✅ Lấy thông tin user từ JWT
export const getMe = (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Không có token' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json(decoded);
    } catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};

// ✅ Gửi email test
export const sendTestEmail = async (req: Request, res: Response) => {
    try {
        const { email, name } = req.body;
        await sendWelcomeEmail(email, name);
        res.json({ message: 'Email đã được gửi' });
    } catch (error) {
        res.status(500).json({ error: 'Gửi email thất bại' });
    }
};
