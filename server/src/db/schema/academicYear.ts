import { mysqlTable, varchar, mysqlEnum, timestamp } from 'drizzle-orm/mysql-core';

export const academicYears = mysqlTable('academic_years', {
  id: varchar('id', { length: 36 }).primaryKey(),
  tahunAjaran: varchar('tahun_ajaran', { length: 20 }).notNull(),
  semester: mysqlEnum('semester', ['ganjil', 'genap']).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
