import { Router } from 'express';
import { db } from '../db/index';
import { rooms } from '../db/schema/rooms';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req, res) => {
    const academicYearId = req.query.academicYearId;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = await db.select().from(rooms)
        .where(eq(rooms.academicYearId, academicYearId))
        .orderBy(rooms.name);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, academicYearId, name, code, capacity } = req.body;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = { id: id || uuid(), academicYearId, name, code, capacity: Number(capacity) || 30 };
    await db.insert(rooms).values(data).onDuplicateKeyUpdate({
        set: { name, code, capacity: Number(capacity) },
    });
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { academicYearId, name, code, capacity } = req.body;
    await db.update(rooms).set({ name, code, capacity: Number(capacity) || 30 }).where(eq(rooms.id, req.params.id));
    res.json({ id: req.params.id, academicYearId, name, code, capacity });
});
router.delete('/:id', async (req, res) => {
    await db.delete(rooms).where(eq(rooms.id, req.params.id));
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=rooms.js.map