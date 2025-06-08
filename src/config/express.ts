import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from '../utils/passportConfig';
import { errorHandler } from '../middleware/errorHandler';
import routes from '../routes';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ chấp nhận file ảnh (PNG, JPG, GIF)'));
        }
        cb(null, true);
    },
});

const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(express.json());
    app.set('trust proxy', 1);
    app.use(
        session({
            secret: process.env.SESSION_SECRET || '5e2d3f7a9c1b4d8e0f6a3c7e5b2d9f0a1c3e4b7d8f9a2c5e7b1d4f6a8c0e3b9z',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: false, // true nếu dùng HTTPS
                maxAge: 1000 * 60 * 60 * 24, // 1 day
            },
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

    app.use('/api', routes);
    app.use(errorHandler);
    app.get('/', (req, res) => {
        res.send('Welcome to the Project Store API');
    });

    return app;
};

export default createApp;
