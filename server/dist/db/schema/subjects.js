import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';
export const subjects = mysqlTable('subjects', {
    id: varchar('id', { length: 36 }).primaryKey(),
    academicYearId: varchar('academic_year_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 200 }).notNull(),
    code: varchar('code', { length: 20 }).notNull(),
    totalSessions: int('total_sessions').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=subjects.js.map