import { Router } from 'express';
import { db } from '../db/index';
import { timeSlots } from '../db/schema/timeSlots';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (_req, res) => {
    const data = await db.select().from(timeSlots).orderBy(timeSlots.dayOfWeek, timeSlots.startTime);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, dayOfWeek, startTime, endTime, type } = req.body;
    const data = { id: id || uuid(), dayOfWeek: Number(dayOfWeek), startTime, endTime, type: type || 'teaching' };
    await db.insert(timeSlots).values(data);
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
    const slots = req.body;
    await db.delete(timeSlots);
    if (slots.length > 0) {
        const values = slots.map((s) => ({ id: s.id, dayOfWeek: Number(s.dayOfWeek), startTime: s.startTime, endTime: s.endTime, type: s.type }));
        await db.insert(timeSlots).values(values);
    }
    res.json(slots);
});
export default router;
//# sourceMappingURL=timeSlots.js.map