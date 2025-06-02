"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const authSocialController_1 = require("../controllers/authSocialController");
const router = (0, express_1.Router)();
// Google OAuth
router.get('/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), authSocialController_1.googleCallback);
// GitHub OAuth
router.get('/github', passport_1.default.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport_1.default.authenticate('github', { failureRedirect: '/login' }), authSocialController_1.githubCallback);
// Lấy thông tin người dùng
router.get('/me', authSocialController_1.getMe);
// Gửi email test
router.post('/send-test-email', authSocialController_1.sendTestEmail);
exports.default = router;
