import * as express from 'express';
import { Request } from 'express';
import { User } from '../../types/user';
// Mở rộng kiểu của Request
declare global {
    namespace Express {
        interface Request {
            user?: User;
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