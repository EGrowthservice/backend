import { Router } from 'express';
import passport from 'passport';
import {
    googleCallback,
    githubCallback,
    getMe,
    sendTestEmail,
} from '../controllers/authSocialController';

const router = Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleCallback);

// GitHub OAuth
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), githubCallback);

// Lấy thông tin người dùng
router.get('/me', getMe);

// Gửi email test
router.post('/send-test-email', sendTestEmail);

export default router;
