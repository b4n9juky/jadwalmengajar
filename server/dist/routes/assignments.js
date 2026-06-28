import { Router } from 'express';
import { db } from '../db/index';
import { assignments } from '../db/schema/assignments';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req, res) => {
    const academicYearId = req.query.academicYearId;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = await db.select().from(assignments)
        .where(eq(assignments.academicYearId, academicYearId));
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, academicYearId, teacherId, subjectId, classId, sessionsPerWeek } = req.body;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = { id: id || uuid(), academicYearId, teacherId, subjectId, classId, sessionsPerWeek: Number(sessionsPerWeek) || 1 };
    await db.insert(assignments).values(data).onDuplicateKeyUpdate({
        set: { teacherId, subjectId, classId, sessionsPerWeek: Number(sessionsPerWeek) },
    });
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { teacherId, subjectId, classId, sessionsPerWeek } = req.body;
    await db.update(assignments).set({ teacherId, subjectId, classId, sessionsPerWeek: Number(sessionsPerWeek) || 1 }).where(eq(assignments.id, req.params.id));
    res.json({ id: req.params.id, teacherId, subjectId, classId, sessionsPerWeek });
});
router.delete('/:id', async (req, res) => {
    await db.delete(assignments).where(eq(assignments.id, req.params.id));
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=assignments.js.map