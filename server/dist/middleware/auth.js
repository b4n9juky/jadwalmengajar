const tokens = new Map();
export function registerToken(token, data) {
    tokens.set(token, { ...data, createdAt: Date.now() });
}
export function revokeToken(token) {
    tokens.delete(token);
}
export function getToken(token) {
    return tokens.get(token) || null;
}
export function requireAuth(req, res, next) {
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
//# sourceMappingURL=auth.js.map