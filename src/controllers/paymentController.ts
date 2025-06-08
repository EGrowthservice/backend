import { Request, Response } from 'express';
import { payos } from '../utils/payosClient';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { orderCode, amount, description } = req.body;
        const paymentData = {
            orderCode,
            amount,
            description,
            returnUrl: `${process.env.CLIENT_URL}/success`,
            cancelUrl: `${process.env.CLIENT_URL}/cancel`,
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
        const paymentInfo = await payos.getPaymentLinkInformation(orderCode);
        res.json(paymentInfo);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
