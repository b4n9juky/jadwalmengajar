import { mysqlTable, varchar, int, timestamp } from 'drizzle-orm/mysql-core';
export const assignments = mysqlTable('assignments', {
    id: varchar('id', { length: 36 }).primaryKey(),
    teacherId: varchar('teacher_id', { length: 36 }).notNull(),
    subjectId: varchar('subject_id', { length: 36 }).notNull(),
    classId: varchar('class_id', { length: 36 }).notNull(),
    sessionsPerWeek: int('sessions_per_week').notNull().default(1),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=assignments.js.map