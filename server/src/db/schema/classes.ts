import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';

export const classes = mysqlTable('classes', {
  id: varchar('id', { length: 36 }).primaryKey(),
  academicYearId: varchar('academic_year_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  gradeLevel: int('grade_level').notNull(),
  section: varchar('section', { length: 10 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
