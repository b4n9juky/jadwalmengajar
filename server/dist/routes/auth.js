import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { registerToken, revokeToken, requireAuth, getToken } from '../middleware/auth';
const router = Router();
const ADMIN_USER = { username: 'admin', password: 'admin123', role: 'admin' };
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        const token = uuid();
        registerToken(token, { username, role: ADMIN_USER.role });
        res.json({ token, user: { username, role: ADMIN_USER.role } });
    }
    else {
        res.status(401).json({ error: 'Username atau password salah' });
    }
});
router.get('/me', requireAuth, (req, res) => {
    const auth = req.headers.authorization;
    const token = auth.slice(7);
    const session = getToken(token);
    res.json({ user: { username: session.username, role: session.role } });
});
router.post('/logout', (req, res) => {
    const auth = req.headers.authorization;
    if (auth?.startsWith('Bearer ')) {
        revokeToken(auth.slice(7));
    }
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=auth.js.map