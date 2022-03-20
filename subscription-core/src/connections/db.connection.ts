import { join } from 'path';
import { ConnectionOptions } from 'typeorm';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, TYPEORM_MIGRATIONS_DIR } from '../config/index';

const BASE_DIR = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

export const dbConnection: ConnectionOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../**/*.migration{.ts,.js}')],
  subscribers: [join(__dirname, '../**/*.subscriber{.ts,. js}')],
  cli: {
    entitiesDir: `${BASE_DIR}/entities`,
    migrationsDir: TYPEORM_MIGRATIONS_DIR,
    subscribersDir: `${BASE_DIR}/subscribers`,
  },
};

export default dbConnection;
