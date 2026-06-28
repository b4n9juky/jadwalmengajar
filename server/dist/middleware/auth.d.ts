import type { Request, Response, NextFunction } from 'express';
export declare function registerToken(token: string, data: {
    username: string;
    role: string;
}): void;
export declare function revokeToken(token: string): void;
export declare function getToken(token: string): {
    username: string;
    role: string;
    createdAt: number;
} | null;
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map