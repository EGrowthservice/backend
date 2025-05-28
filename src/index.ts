import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from './utils/passportConfig';
import authOAuth from './routes/authOAuth';
import authRoutes from './routes/authRoutes';
import utilsRoutes from './routes/utilsRoutes';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET || '121221zxcxzczcxc',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    })
);

// Routes
app.use('/api/authSocial', authOAuth);
app.use('/api/auth', authRoutes);
app.use('/api/utils', utilsRoutes);

// Middleware lỗi (error handler)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Đã xảy ra lỗi server', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
