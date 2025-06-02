"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_session_1 = __importDefault(require("express-session"));
const passportConfig_1 = __importDefault(require("../utils/passportConfig"));
const errorHandler_1 = require("../middleware/errorHandler");
const routes_1 = __importDefault(require("../routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL, credentials: true }));
    app.use(express_1.default.json());
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || '',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' },
    }));
    app.use(passportConfig_1.default.initialize());
    app.use(passportConfig_1.default.session());
    app.use((0, express_rate_limit_1.default)({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.use('/api', routes_1.default);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.default = createApp;
