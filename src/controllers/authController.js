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
exports.logout = exports.changePassword = exports.resetPassword = exports.forgotPassword = exports.login = exports.verifyEmail = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const supabase_1 = require("../utils/supabase");
const validator_1 = __importDefault(require("validator"));
const sendEmail_1 = require("../utils/sendEmail");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d');
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET không được định nghĩa trong file .env');
}
// Tạo token xác thực email và reset password
const createToken = (payload, expiresIn = '15m') => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn });
};
// Đăng ký
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role = 'user' } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ message: 'Thiếu thông tin' });
            return;
        }
        if (!validator_1.default.isEmail(email)) {
            res.status(400).json({ message: 'Email không hợp lệ' });
            return;
        }
        const { data: existingUser, error: userError } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (userError && userError.code !== 'PGRST116')
            throw userError;
        if (existingUser) {
            res.status(400).json({ message: 'Người dùng đã tồn tại' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const { error } = yield supabase_1.supabase.from('users').insert([
            { email, password: hashedPassword, name, role, is_verified: false },
        ]);
        if (error)
            throw error;
        // Gửi email xác thực
        const verifyToken = createToken({ email }, '30m');
        const link = `${process.env.BASE_URL}/api/auth/verify-email?token=${verifyToken}`;
        yield (0, sendEmail_1.sendEmail)(email, 'Xác thực tài khoản', `<a href="${link}">Bấm vào đây để xác thực</a>`);
        res.status(201).json({ message: 'Đăng ký thành công, kiểm tra email để xác thực!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi tạo người dùng', error });
    }
});
exports.register = register;
// Xác thực email
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: 'Thiếu token xác thực' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { email } = decoded;
        const { error } = yield supabase_1.supabase
            .from('users')
            .update({ is_verified: true })
            .eq('email', email);
        if (error)
            throw error;
        res.status(200).json({ message: 'Xác thực thành công! Bạn có thể đăng nhập.' });
    }
    catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
});
exports.verifyEmail = verifyEmail;
// Đăng nhập
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Thiếu thông tin' });
            return;
        }
        const { data: user, error: userError } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (userError && userError.code !== 'PGRST116')
            throw userError;
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(400).json({ message: 'Thông tin đăng nhập không đúng' });
            return;
        }
        if (!user.is_verified) {
            res.status(403).json({ message: 'Vui lòng xác thực email trước' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error });
    }
});
exports.login = login;
// Quên mật khẩu
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'Nhập email' });
            return;
        }
        const { data: user, error: userError } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (userError && userError.code !== 'PGRST116')
            throw userError;
        if (!user) {
            res.status(400).json({ message: 'Email không tồn tại' });
            return;
        }
        const resetToken = createToken({ email }, '15m');
        const link = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;
        yield (0, sendEmail_1.sendEmail)(email, 'Đặt lại mật khẩu', `<a href="${link}">Bấm để đặt lại mật khẩu</a>`);
        res.status(200).json({ message: 'Đã gửi link đặt lại mật khẩu qua email' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi gửi email đặt lại mật khẩu', error });
    }
});
exports.forgotPassword = forgotPassword;
// Đặt lại mật khẩu
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;
        if (!token || typeof token !== 'string' || !newPassword) {
            res.status(400).json({ message: 'Thiếu dữ liệu' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const { email } = decoded;
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const { error } = yield supabase_1.supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', email);
        if (error)
            throw error;
        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!' });
    }
    catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
});
exports.resetPassword = resetPassword;
// Đổi mật khẩu
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: 'Cả mật khẩu cũ và mật khẩu mới đều là bắt buộc' });
            return;
        }
        const { data: user, error: userError } = yield supabase_1.supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (userError && userError.code !== 'PGRST116')
            throw userError;
        if (!user) {
            res.status(400).json({ message: 'Người dùng không tồn tại' });
            return;
        }
        const isOldPasswordValid = yield bcrypt_1.default.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
            return;
        }
        const hashedNewPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const { error } = yield supabase_1.supabase
            .from('users')
            .update({ password: hashedNewPassword })
            .eq('id', userId);
        if (error)
            throw error;
        res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu', error });
    }
});
exports.changePassword = changePassword;
// Đăng xuất
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Đăng xuất thành công' });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi đăng xuất', error });
    }
});
exports.logout = logout;
