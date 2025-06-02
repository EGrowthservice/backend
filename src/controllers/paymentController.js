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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentStatus = exports.createPayment = void 0;
const payosClient_1 = require("../utils/payosClient");
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderCode, amount, description } = req.body;
        const paymentData = {
            orderCode,
            amount,
            description,
            returnUrl: 'http://localhost:3000/success',
            cancelUrl: 'http://localhost:3000/cancel',
        };
        const paymentLink = yield payosClient_1.payos.createPaymentLink(paymentData);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createPayment = createPayment;
const getPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderCode } = req.params;
        const paymentInfo = yield payosClient_1.payos.getPaymentInformation(orderCode);
        res.json(paymentInfo);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPaymentStatus = getPaymentStatus;
