"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestEmail = exports.getMe = exports.githubCallback = exports.googleCallback = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../utils/sendEmail");
const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const IS_PROD = process.env.NODE_ENV === 'production';
// ✅ Google OAuth callback
const googleCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield (0, sendEmail_1.sendWelcomeEmail)(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: IS_PROD });
        res.redirect(`${CLIENT_URL}/auth/callback?token=${user.token}`);
    }
    catch (error) {
        res.redirect('/login');
    }
});
exports.googleCallback = googleCallback;
// ✅ GitHub OAuth callback
const githubCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        yield (0, sendEmail_1.sendWelcomeEmail)(user.profile.email, user.profile.name);
        res.cookie('jwt', user.token, { httpOnly: true, secure: IS_PROD });
        res.redirect(`${CLIENT_URL}/auth/callback?token=${user.token}`);
    }
    catch (error) {
        res.redirect('/login');
    }
});
exports.githubCallback = githubCallback;
// ✅ Lấy thông tin user từ JWT
const getMe = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Không có token' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json(decoded);
    }
    catch (error) {
        res.status(401).json({ error: 'Token không hợp lệ' });
    }
};
exports.getMe = getMe;
// ✅ Gửi email test
const sendTestEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        yield (0, sendEmail_1.sendWelcomeEmail)(email, name);
        res.json({ message: 'Email đã được gửi' });
    }
    catch (error) {
        res.status(500).json({ error: 'Gửi email thất bại' });
    }
});
exports.sendTestEmail = sendTestEmail;
