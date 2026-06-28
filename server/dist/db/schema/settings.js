import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';
export const settings = mysqlTable('settings', {
    key: varchar('key', { length: 50 }).primaryKey(),
    value: varchar('value', { length: 200 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});
//# sourceMappingURL=settings.js.map