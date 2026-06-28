import type { Request, Response, NextFunction } from 'express';

const tokens = new Map<string, { username: string; role: string; createdAt: number }>();

export function registerToken(token: string, data: { username: string; role: string }) {
  tokens.set(token, { ...data, createdAt: Date.now() });
}

export function revokeToken(token: string) {
  tokens.delete(token);
}

export function getToken(token: string) {
  return tokens.get(token) || null;
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Tidak terautentikasi' });
    return;
  }
  const session = tokens.get(auth.slice(7));
  if (!session) {
    res.status(401).json({ error: 'Token tidak valid' });
    return;
  }
  next();
}
