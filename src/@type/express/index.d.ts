import * as express from 'express';
import { Request } from 'express';

// Mở rộng kiểu của Request
declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email: string; role: string };
        }
    }
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    role: string;
}

export interface AuthenticatedRequest extends Request {
    user?: AuthenticatedUser;
}