"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.post('/create', paymentController_1.createPayment);
router.get('/status/:orderCode', paymentController_1.getPaymentStatus);
exports.default = router;
