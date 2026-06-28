import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
export const teachers = mysqlTable('teachers', {
    id: varchar('id', { length: 36 }).primaryKey(),
    name: varchar('name', { length: 200 }).notNull(),
    nip: varchar('nip', { length: 30 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    email: varchar('email', { length: 100 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=teachers.js.map