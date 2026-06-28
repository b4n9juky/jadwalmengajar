import { Router } from 'express';
import { db } from '../db/index';
import { classes } from '../db/schema/classes';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
const router = Router();
router.get('/', async (_req, res) => {
    const data = await db.select().from(classes).orderBy(classes.gradeLevel, classes.section);
    res.json(data);
});
router.post('/', async (req, res) => {
    const { id, name, gradeLevel, section } = req.body;
    const data = { id: id || uuid(), name, gradeLevel: Number(gradeLevel), section };
    await db.insert(classes).values(data);
    res.json(data);
});
router.put('/:id', async (req, res) => {
    const { name, gradeLevel, section } = req.body;
    await db.update(classes).set({ name, gradeLevel: Number(gradeLevel), section }).where(eq(classes.id, req.params.id));
    res.json({ id: req.params.id, name, gradeLevel, section });
});
router.delete('/:id', async (req, res) => {
    await db.delete(classes).where(eq(classes.id, req.params.id));
    res.json({ ok: true });
});
export default router;
//# sourceMappingURL=classes.js.map