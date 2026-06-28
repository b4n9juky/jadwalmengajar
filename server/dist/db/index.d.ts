import 'dotenv/config';
import mysql from 'mysql2/promise';
import * as schema from './schema/index';
declare const pool: mysql.Pool;
export declare const db: import("drizzle-orm/mysql2").MySql2Database<typeof schema> & {
    $client: mysql.Pool;
};
export default pool;
//# sourceMappingURL=index.d.ts.map