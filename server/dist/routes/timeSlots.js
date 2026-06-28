import { Router } from 'express';
import { db } from '../db/index';
import { timeSlots } from '../db/schema/timeSlots';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (req, res) => {
    const academicYearId = req.query.academicYearId;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = await db.select().from(timeSlots)
        .where(eq(timeSlots.academicYearId, academicYearId))
        .orderBy(timeSlots.dayOfWeek, timeSlots.startTime);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, academicYearId, dayOfWeek, startTime, endTime, type } = req.body;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    const data = { id: id || uuid(), academicYearId, dayOfWeek: Number(dayOfWeek), startTime, endTime, type: type || 'teaching' };
    await db.insert(timeSlots).values(data).onDuplicateKeyUpdate({
        set: { dayOfWeek: data.dayOfWeek, startTime: data.startTime, endTime: data.endTime, type: data.type },
    });
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { dayOfWeek, startTime, endTime, type } = req.body;
    await db.update(timeSlots).set({
        dayOfWeek: Number(dayOfWeek), startTime, endTime, type: type || 'teaching',
    }).where(eq(timeSlots.id, req.params.id));
    res.json({ id: req.params.id, dayOfWeek, startTime, endTime, type });
});
router.delete('/:id', async (req, res) => {
    await db.delete(timeSlots).where(eq(timeSlots.id, req.params.id));
    res.json({ ok: true });
});
router.put('/', async (req, res) => {
    const { academicYearId, slots } = req.body;
    if (!academicYearId) {
        res.status(400).json({ error: 'academicYearId required' });
        return;
    }
    await db.delete(timeSlots).where(eq(timeSlots.academicYearId, academicYearId));
    if (slots.length > 0) {
        const values = slots.map((s) => ({ id: s.id, academicYearId, dayOfWeek: Number(s.dayOfWeek), startTime: s.startTime, endTime: s.endTime, type: s.type }));
        for (const v of values) {
            await db.insert(timeSlots).values(v).onDuplicateKeyUpdate({
                set: { dayOfWeek: v.dayOfWeek, startTime: v.startTime, endTime: v.endTime, type: v.type },
            });
        }
    }
    res.json(slots);
});
export default router;
//# sourceMappingURL=timeSlots.js.map