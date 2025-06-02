"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authOAuth_1 = __importDefault(require("./authOAuth"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const utilsRoutes_1 = __importDefault(require("./utilsRoutes"));
const payment_1 = __importDefault(require("./payment"));
const router = (0, express_1.Router)();
router.use('/authSocial', authOAuth_1.default);
router.use('/auth', authRoutes_1.default);
router.use('/utils', utilsRoutes_1.default);
router.use('/payment', payment_1.default);
exports.default = router;
