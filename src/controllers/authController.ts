import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { supabase } from '../config/supabase';
import validator from 'validator';
import { sendEmail } from '../utils/sendEmail';
import jwt, { SignOptions } from 'jsonwebtoken';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
import { AuthenticatedRequest } from '../@type/express/index';


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET không được định nghĩa trong file .env');
}

// Tạo token xác thực email và reset password
const createToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '15m'): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

// Đăng ký
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, role = 'user' } = req.body;

        if (!email || !password || !name) {
            res.status(400).json({ message: 'Thiếu thông tin' });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({ message: 'Email không hợp lệ' });
            return;
        }

        const { data: existingUser, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        if (existingUser) {
            res.status(400).json({ message: 'Người dùng đã tồn tại' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const { error } = await supabase.from('users').insert([
            { email, password: hashedPassword, name, role, is_verified: false },
        ]);

        if (error) throw error;

        // Gửi email xác thực
        const verifyToken = createToken({ email }, '30m');
        const link = `${process.env.BASE_URL}/api/auth/verify-email?token=${verifyToken}`;
        await sendEmail(email, 'Xác thực tài khoản', `<a href="${link}">Bấm vào đây để xác thực</a>`);

        res.status(201).json({ message: 'Đăng ký thành công, kiểm tra email để xác thực!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi tạo người dùng', error });
    }
};

// Xác thực email
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token || typeof token !== 'string') {
            res.status(400).json({ message: 'Thiếu token xác thực' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        const { email } = decoded;

        const { error } = await supabase
            .from('users')
            .update({ is_verified: true })
            .eq('email', email);

        if (error) throw error;

        res.status(200).json({ message: 'Xác thực thành công! Bạn có thể đăng nhập.' });
    } catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

// Đăng nhập
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Thiếu thông tin' });
            return;
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(400).json({ message: 'Thông tin đăng nhập không đúng' });
            return;
        }

        if (!user.is_verified) {
            res.status(403).json({ message: 'Vui lòng xác thực email trước' });
            return;
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng nhập', error });
    }
};

// Quên mật khẩu
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: 'Nhập email' });
            return;
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        if (!user) {
            res.status(400).json({ message: 'Email không tồn tại' });
            return;
        }

        const resetToken = createToken({ email }, '15m');
        const link = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

        await sendEmail(email, 'Đặt lại mật khẩu', `<a href="${link}">Bấm để đặt lại mật khẩu</a>`);

        res.status(200).json({ message: 'Đã gửi link đặt lại mật khẩu qua email' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi gửi email đặt lại mật khẩu', error });
    }
};

// Đặt lại mật khẩu
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if (!token || typeof token !== 'string' || !newPassword) {
            res.status(400).json({ message: 'Thiếu dữ liệu' });
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        const { email } = decoded;

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', email);

        if (error) throw error;

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công!' });
    } catch (error) {
        res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
};

// Đổi mật khẩu
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = (req as AuthenticatedRequest).user?.id;


        if (!oldPassword || !newPassword) {
            res.status(400).json({ message: 'Cả mật khẩu cũ và mật khẩu mới đều là bắt buộc' });
            return;
        }

        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (userError && userError.code !== 'PGRST116') throw userError;
        if (!user) {
            res.status(400).json({ message: 'Người dùng không tồn tại' });
            return;
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            res.status(400).json({ message: 'Mật khẩu cũ không chính xác' });
            return;
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const { error } = await supabase
            .from('users')
            .update({ password: hashedNewPassword })
            .eq('id', userId);

        if (error) throw error;

        res.status(200).json({ message: 'Mật khẩu đã được thay đổi thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi thay đổi mật khẩu', error });
    }
};

// Đăng xuất
export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi đăng xuất', error });
    }
};