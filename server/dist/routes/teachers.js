import { Router } from 'express';
import { db } from '../db/index';
import { teachers } from '../db/schema/teachers';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (_req, res) => {
    const data = await db.select().from(teachers).orderBy(teachers.name);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, name, nip, phone, email } = req.body;
    const data = { id: id || uuid(), name, nip, phone: phone || null, email: email || null };
    await db.insert(teachers).values(data);
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { name, nip, phone, email } = req.body;
    await db.update(teachers).set({ name, nip, phone: phone || null, email: email || null }).where(eq(teachers.id, req.params.id));
    res.json({ id: req.params.id, name, nip, phone, email });
});
router.delete('/:id', async (req, res) => {
    await db.delete(teachers).where(eq(teachers.id, req.params.id));
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=teachers.js.map