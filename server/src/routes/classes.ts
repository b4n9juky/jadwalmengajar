import { Router } from 'express';
import { db } from '../db/index';
import { classes } from '../db/schema/classes';
import { eq } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';

const router = Router();

router.get('/', async (req, res) => {
  const academicYearId = req.query.academicYearId as string;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = await db.select().from(classes)
    .where(eq(classes.academicYearId, academicYearId))
    .orderBy(classes.gradeLevel, classes.section);
  res.json(data);
});

router.post('/', async (req, res) => {
  const { id, academicYearId, name, gradeLevel, section } = req.body;
  if (!academicYearId) {
    res.status(400).json({ error: 'academicYearId required' });
    return;
  }
  const data = { id: id || uuid(), academicYearId, name, gradeLevel: Number(gradeLevel), section };
  await db.insert(classes).values(data);
  res.json(data);
});

router.put('/:id', async (req, res) => {
  const { academicYearId, name, gradeL