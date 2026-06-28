import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';
export const availabilities = mysqlTable('availabilities', {
    id: varchar('id', { length: 36 }).primaryKey(),
    teacherId: varchar('teacher_id', { length: 36 }).notNull(),
    dayOfWeek: int('day_of_week').notNull(),
    startTime: varchar('start_time', { length: 5 }).notNull(),
    endTime: varchar('end_time', { length: 5 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=availabilities.js.map