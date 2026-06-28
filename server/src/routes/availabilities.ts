import { Router } from 'express';
import { db } from '../db/index';
import { availabilities } from '../db/schema/availabilities';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  const academicYearId = req.query.academicYearId as string;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = await db.select().from(availabilities)
    .where(eq(availabilities.academicYearId, academicYearId));
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, academicYearId, teacherId, dayOfWeek, startTime, endTime } = req.body;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = { id: id || uuid(), academicYearId, teacherId, dayOfWeek: Number(dayOfWeek), startTime, endTime };
  await db.insert(availabilities).values(data).onDuplicateKeyUpdate({
    set: { teacherId, dayOfWeek: Number(dayOfWeek), startTime, endTime },
  });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { teacherId, dayOfWeek, startTime, endTime } = req.body;
  await db.update(availabilities).set({ teacherId, dayOfWeek: Number(dayOfWeek), startTime, endTime }).where(eq(availabilities.id, req.params.id));
  res.json({ id: req.params.id, teacherId, dayOfWeek, startTime, endTime });
});

router.delete('/:id', async (req, res) => {
  await db.delete(availabilities).where(eq(availabilities.id, req.params.id));
  res.json({ ok: true });
});

export default router;
