import { Router } from 'express';
import { db } from '../db/index';
import { subjects } from '../db/schema/subjects';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req, res) => {
    const academicYearId = req.query.academicYearId;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = await db.select().from(subjects)
        .where(eq(subjects.academicYearId, academicYearId))
        .orderBy(subjects.name);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, academicYearId, name, code, totalSessions } = req.body;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = { id: id || uuid(), academicYearId, name, code, totalSessions: Number(totalSessions) || 0 };
    await db.insert(subjects).values(data).onDuplicateKeyUpdate({
        set: { name, code, totalSessions: Number(totalSessions) },
    });
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { academicYearId, name, code, totalSessions } = req.body;
    await db.update(subjects).set({ name, code, totalSessions: Number(totalSessions) || 0 }).where(eq(subjects.id, req.params.id));
    res.json({ id: req.params.id, academicYearId, name, code, totalSessions });
});
router.delete('/:id', async (req, res) => {
    await db.delete(subjects).where(eq(subjects.id, req.params.id));
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=subjects.js.map