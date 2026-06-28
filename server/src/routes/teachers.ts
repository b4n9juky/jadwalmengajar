import { Router } from 'express';
import { db } from '../db/index';
import { teachers } from '../db/schema/teachers';
import { eq, and } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  const academicYearId = req.query.academicYearId as string;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = await db.select().from(teachers)
    .where(eq(teachers.academicYearId, academicYearId))
    .orderBy(teachers.name);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, academicYearId, name, nip, phone, email } = req.body;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = { id: id || uuid(), academicYearId, name, nip, phone: phone || null, email: email || null };
  await db.insert(teachers).values(data).onDuplicateKeyUpdate({
    set: { name, nip, phone: phone || null, email: email || null },
  });
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { academicYearId, name, nip, phone, email } = req.body;
  await db.update(teachers).set({ name, nip, phone: phone || null, email: email || null }).where(eq(teachers.id, req.params.id));
  res.json({ id: req.params.id, academicYearId, name, nip, phone, email });
});

router.delete('/:id', async (req, res) => {
  await db.delete(teachers).where(eq(teachers.id, req.params.id));
  res.json({ ok: true });
});

export default router;
