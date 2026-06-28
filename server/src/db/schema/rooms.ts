import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';

export const rooms = mysqlTable('rooms', {
  id: varchar('id', { length: 36 }).primaryKey(),
  academicYearId: varchar('academic_year_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  code: varchar('code', { length: 20 }).notNull(),
  capacity: int('capacity').notNull().default(30),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
