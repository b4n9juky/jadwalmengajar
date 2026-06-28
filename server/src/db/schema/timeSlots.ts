import { mysqlTable, varchar, int, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';

export const timeSlots = mysqlTable('time_slots', {
  id: varchar('id', { length: 36 }).primaryKey(),
  academicYearId: varchar('academic_year_id', { length: 36 }).notNull(),
  dayOfWeek: int('day_of_week').notNull(),
  startTime: varchar('start_time', { length: 5 }).notNull(),
  endTime: varchar('end_time', { length: 5 }).notNull(),
  type: mysqlEnum('type', ['teaching', 'break']).notNull().default('teaching'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
