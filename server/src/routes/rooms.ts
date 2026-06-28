import { Router } from 'express';
import { db } from '../db/index';
import { rooms } from '../db/schema/rooms';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (_req, res) => {
  const data = await db.select().from(rooms).orderBy(rooms.name);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, name, code, capacity } = req.body;
  const data = { id: id || uuid(), name, code, capacity: Number(capacity) || 30 };
  await db.insert(rooms).values(data);
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { name, code, capacity } = req.body;
  await db.update(rooms).set({ name, code, capacity: Number(capacity) || 30 }).where(eq(rooms.id, req.params.id));
  res.json({ id: req.params.id, name, code, capacity });
});

router.delete('/:id', async (req, res) => {
  await db.delete(rooms).where(eq(rooms.id, req.params.id));
  res.json({ ok: true });
});

export default router;
