import * as express from 'express';

// Mở rộng kiểu của Request
declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email: string; role: string };
        }
    }
}