import { Router } from 'express';
import { db } from '../db/index';
import { settings } from '../db/schema/settings';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (_req, res) => {
  const rows = await db.select().from(settings);
  const result: Record<string, string> = {};
  for (const row of rows) result[row.key] = row.value;
  res.json(result);
});

router.put('/', async (req, res) => {
  const entries = req.body as Record<string, string>;
  for (const [key, value] of Object.entries(entries)) {
    const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
    if (existing.length > 0) {
      await db.update(settings).set({ value }).where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({ key, value });
    }
  }
  res.json({ ok: true });
});

export default router;
