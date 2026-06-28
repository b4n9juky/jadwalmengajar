import { Router } from 'express';
import { db } from '../db/index';
import { academicYears } from '../db/schema/academicYear';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (_req, res) => {
  const data = await db.select().from(academicYears);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, tahunAjaran, semester } = req.body;
  const data = { id: id || uuid(), tahunAjaran, semester };
  await db.insert(academicYears).values(data).onDuplicateKeyUpdate({
    set: { tahunAjaran, semester },
  });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { tahunAjaran, semester } = req.body;
  await db.update(academicYears).set({ tahunAjaran, semester }).where(eq(academicYears.id, req.params.id));
  res.json({ id: req.params.id, tahunAjaran, semester });
});

router.delete('/:id', async (req, res) => {
  await db.delete(academicYears).where(eq(academicYears.id, req.params.id));
  res.json({ ok: true });
});

export default router;
