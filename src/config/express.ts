import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import passport from '../utils/passportConfig';
import { errorHandler } from '../middleware/errorHandler';
import routes from '../routes';
import dotenv from 'dotenv';

dotenv.config();

const createApp = () => {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(express.json());

    app.use(
        session({
            secret: process.env.SESSION_SECRET || '',
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

    app.use('/api', routes);
    app.use(errorHandler);
    app.get('/', (req, res) => {
        res.send('Welcome to the Project Store API');
    });

    return app;
};

export default createApp;
