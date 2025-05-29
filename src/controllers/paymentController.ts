import { Request, Response } from 'express';
import { payos } from '../utils/payosClient';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { orderCode, amount, description } = req.body;
        const paymentData = {
            orderCode,
            amount,
            description,
            returnUrl: 'http://localhost:3000/success',
            cancelUrl: 'http://localhost:3000/cancel',
        };

        const paymentLink = await payos.createPaymentLink(paymentData);
        res.json({ checkoutUrl: paymentLink.checkoutUrl });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { orderCode } = req.params;
        const paymentInfo = await payos.getPaymentInformation(orderCode);
        res.json(paymentInfo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
