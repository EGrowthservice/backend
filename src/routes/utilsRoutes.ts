import { Router, Request, Response } from 'express';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy' });
});

export default router;